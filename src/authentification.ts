import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking } from "react-native";
import { FriendRequestsRecord, FriendsWithRecord, MosaicMembersRecord, MosaicRecord, PhotosRecord, UserRecord } from "types";
import { pb, createWeeklyChallengeRecord } from "./pocketbaseService";
import qs from 'qs'

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
                Promise.all(DEFAULT_CHALLENGES.map((challenge_id: string) => createWeeklyChallengeRecord(challenge_id, user.id)))
                            .catch((error: any) => console.log("Error during challenge selection: ", error.response))

                pb.collection("mosaics").create<MosaicRecord>(formDataMosaic)
                    .then((mosaic: MosaicRecord) => {
                        pb.collection("mosaic_members").create<MosaicMembersRecord>({
                            mosaic_id: mosaic.id,
                            user_id: user.id,
                        }).catch((error: any) => console.log("Error during mosaic member creation: ", error.response))

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

export async function deleteAccount(user:UserRecord|null): Promise<void> {
    if (user === null) {
        Alert.alert("You need to be logged in to delete your account")
        return
    }
    //const mail = "habits@ja.tum.de"
    const mail = "marquardt.ac@gmail.com"
    const subject = "Account Deletion Be Healthy"
    const body = `User ${user.username} requests Account Deletion. UserID: ${user.id}`

    let url = `mailto:<${mail}>?subject=<'${subject}'>&body=<'${body}'>`
    console.log(url)

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }
    else {
        await Linking.openURL(url);
    }

    logout()

    // console.log("inside deleteaccount")

    // async function deleteRecord(collection_name:string, record_id:string) {
    //     await pb.collection(collection_name).delete(record_id)
    // }

    // async function deleteFromCollection(collection_name:string, filter_param:string) {
    //     pb.collection(collection_name)
    //         .getFullList({filter:filter_param})
    //         .then(records => records.map(record => deleteRecord(collection_name, record.id)))
    // }

    // async function updateNullRecord(collection_name: string, field_name:string, record_id:string) {
    //     await pb.collection(collection_name).update(record_id, {field_name: user!.id})
    // }

    // async function updateCollection(collection_name:string, field_name:string) {
    //     pb.collection(collection_name)
    //         .getFullList({filter: `${field_name} = null`})
    //         .then(records => records.map(record => updateNullRecord(collection_name, field_name, record.id)))
    // }

    // let data = new FormData()
    // data.append("id", user.id)
    // data.append("username", user.id)
    // data.append("email", `${user.id}@deleted.de`)
    // data.append("password", "Test123456")
    // data.append("passwordConfirm", "Test123456")
    // // data.append("name", "")
    // // data.append("avatar", "")
    // // data.append("phonenumber", "")
    // data.append("gender", user.gender)
    // data.append("birthdate", user.birthdate)
    // data.append("isStudent", user.isStudent)
    // // data.append("lastSurvey", "")
    // console.log("after formdata")
    
    // await pb.collection("users").delete(user.id)

    // console.log("after deletion")

    // await pb.collection("users").create(data)
    // console.log("after creation")
    
    // await updateCollection("initial_survey", "user")
    // await updateCollection("survey_answers", "user")
    // await updateCollection("weekly_challenges", "user_id")
    // console.log("after update")

    // await pb.collection("users").requestEmailChange("deleted@deleted.de")

    // console.log("after email change")
    // await deleteFromCollection("photos", `user_id = '${user.id}'`) //also deletes contains records
    // await deleteFromCollection("mosaic_members", `user_id = '${user.id}'`)
    // await deleteFromCollection("friends_with", `user1 = '${user.id}' || user2 = '${user.id}'`)
    // await deleteFromCollection("friend_requests", `from = '${user.id}' || to = '${user.id}'`)
    
    // console.log("after deletion")

    // await pb.collection("users").update(user.id, data)

    // console.log("after update")
    
    // await AsyncStorage.removeItem(VAR_USERNAME)
    // await AsyncStorage.removeItem(VAR_PASSWORD)
    // return pb.authStore.clear()
}