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
export async function signup(username: string, password: string): Promise<UserRecord> {
    const data: any = {
        username: username,
        password: password,
        passwordConfirm: password,
    }
    await pb.collection("users").create<UserRecord>(data)
    return login(username, password)
}

export async function logout(): Promise<void> {
    await AsyncStorage.removeItem(VAR_USERNAME)
    await AsyncStorage.removeItem(VAR_PASSWORD)
    return pb.authStore.clear()
    // When the user is logged out when they close the app, they need login when reopening it
}