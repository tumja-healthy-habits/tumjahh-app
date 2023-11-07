import { UserRecord } from "types";
import { pb } from "./pocketbaseService";
import AsyncStorage from "@react-native-async-storage/async-storage"

// the keys used in the local storage
export const VAR_USERNAME: string = "BeHealthyUsername"
export const VAR_PASSWORD: string = "BeHealthyPassword"

// returns whether the login attempt was successful
export async function login(username: string, password: string): Promise<UserRecord> {
    return pb.collection("users").authWithPassword<UserRecord>(username, password)
        .then(({ record }) => record)
}


// returns the newly created user record
export async function signup(username: string, name: string, email: string, pw: string, pwConfirm: string): Promise<UserRecord> { 
    try{
        const data: any = {
            username: username,
            name: name,
            email: email,
            password: pw,
            passwordConfirm: pwConfirm,
        }
        await pb.collection("users").create<UserRecord>(data)
        return login(username, pw)
    }
    catch(error) {
        console.log(error.response)
        if ("username" in error.response.data) {
            if (error.response.data.username.code == "validation_invalid_username") {
                throw new Error(error.response.data.username.code)
            }
        }
        else if ("password" in error.response.data) {
            if (error.response.data.password.code == "validation_required") {
                throw new Error(error.response.data.password.code)
            }
        }
        else if ("email" in error.response.data) {
            if (error.response.data.email.code == "validation_invalid_email") {
                throw new Error(error.response.data.email.code)
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