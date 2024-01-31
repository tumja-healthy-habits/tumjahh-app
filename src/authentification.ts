import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { MosaicMembersRecord, MosaicRecord, UserRecord } from "types";
import { pb, selectChallenge } from "./pocketbaseService";

// the keys used in the local storage
export const VAR_USERNAME: string = "BeHealthyUsername"
export const VAR_PASSWORD: string = "BeHealthyPassword"

export const DEFAULT_CHALLENGES: string[] = [
    "zatllby504vdmlh",
    "miqzs42e9wvitm8",
    "woskvdyapzqsp44",
]

// returns whether the login attempt was successful
export async function login(username: string, password: string): Promise<UserRecord> {
    return pb.collection("users").authWithPassword<UserRecord>(username, password)
        .then(({ record }) => record)
}


// returns the newly created user record
export async function signup(username: string, name: string, email: string, pw: string, pwConfirm: string, phoneNumber: string, gender: string, birthdate: Date, isStudent: boolean, profilePicture: any): Promise<UserRecord | void> {
    const formData: FormData = new FormData()
    if (profilePicture !== undefined) formData.append('avatar', {
        uri: profilePicture.uri,
        name: profilePicture.uri,
        type: "image/jpg"
    } as any)
    formData.append("username", username)
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", pw)
    formData.append("passwordConfirm", pwConfirm)
    formData.append("phoneNumber", phoneNumber)
    formData.append("gender", gender)
    formData.append("birthdate", birthdate.toISOString())
    formData.append("isStudent", isStudent.toString())

    const formDataMosaic = new FormData()
    formDataMosaic.append("name", `${username}'s Mosaic`)
    if (profilePicture !== undefined) formDataMosaic.append('thumbnail', {
        uri: profilePicture.uri,
        name: profilePicture.uri,
        type: "image/jpg"
    } as any)

    return pb.collection("users").create<UserRecord>(formData)
        .then((user: UserRecord) => {
            login(username, pw).then(() => {
                pb.collection("mosaics").create<MosaicRecord>(formDataMosaic)
                    .then((mosaic: MosaicRecord) => {
                        pb.collection("mosaic_members").create<MosaicMembersRecord>({
                            mosaic_id: mosaic.id,
                            user_id: user.id,
                        }).catch((error: any) => console.log("Error during mosaic member creation: ", error.response))

                        Promise.all(DEFAULT_CHALLENGES.map((challenge_id: string) => selectChallenge(challenge_id, user.id)))
                            .catch((error: any) => console.log("Error during challenge selection: ", error.response))
                    }).catch((error: any) => console.log("Error during mosaic creation: ", error.response))
            })
            return user
        })
        .catch((error: any) => {
            console.log("Error during signup: ", error.response)
            for (const key in error.response.data) {
                if (error.response.data[key]["code"] == "validation_required") {
                    Alert.alert("Please fill out all mandatory fields (denoted with '*')")
                    return
                }
            }
            if ("username" in error.response.data) {
                if (error.response.data.username.code == "validation_invalid_username") {
                    Alert.alert("Username already exists.\n Please choose a different username")
                }
            }
            else if ("email" in error.response.data) {
                if (error.response.data.email.code == "validation_invalid_email") {
                    Alert.alert("E-Mail already registered.\n Please use a different E-Mail")
                }
            }
            else if ("password" in error.response.data) {
                if (error.response.data.password.code == "validation_length_out_of_range") {
                    Alert.alert("Password must be at least 8 characters long")
                }
                else if (error.response.data.password.code == "validation_required") {
                    Alert.alert("Please choose a password")
                }
            }
            else if ("passwordConfirm" in error.response.data) {
                if (error.response.data.passwordConfirm.code == "validation_values_mismatch") {
                    Alert.alert("Confirm Password and Password must be the same")
                }
            }
        })
}

export async function logout(): Promise<void> {
    await AsyncStorage.removeItem(VAR_USERNAME)
    await AsyncStorage.removeItem(VAR_PASSWORD)
    return pb.authStore.clear()
    // When the user is logged out when they close the app, they need login when reopening it
}