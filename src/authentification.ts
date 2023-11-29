import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserRecord } from "types";
import { pb } from "./pocketbaseService";
import {Alert} from "react-native"

// the keys used in the local storage
export const VAR_USERNAME: string = "BeHealthyUsername"
export const VAR_PASSWORD: string = "BeHealthyPassword"

// returns whether the login attempt was successful
export async function login(username: string, password: string): Promise<UserRecord> {
    return pb.collection("users").authWithPassword<UserRecord>(username, password)
        .then(({ record }) => record)
}


// returns the newly created user record
export async function signup(username: string, name: string, email: string, pw: string, pwConfirm: string, phoneNumber:string, gender:string, birthdate:Date, isStudent:boolean): Promise<UserRecord | undefined> {
    try {
        const data: any = {
            username: username,
            name: name,
            email: email,
            password: pw,
            passwordConfirm: pwConfirm,
            phoneNumber:phoneNumber,
            gender:gender,
            birthdate:birthdate,
            isStudent:isStudent
        }
        console.log(pw)
        await pb.collection("users").create<UserRecord>(data)
        return login(username, pw)
    }
    catch (error: any) {
        console.log(error.response)
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
    }
}

export async function logout(): Promise<void> {
    await AsyncStorage.removeItem(VAR_USERNAME)
    await AsyncStorage.removeItem(VAR_PASSWORD)
    return pb.authStore.clear()
    // When the user is logged out when they close the app, they need login when reopening it
}