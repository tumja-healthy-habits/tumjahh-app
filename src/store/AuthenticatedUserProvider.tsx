import { BaseModel } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserRecord } from "types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VAR_PASSWORD, VAR_USERNAME } from "src/authentification";

// define the type of state we want to make available to the whole application
type AuthenticatedUserState = {
    currentUser: UserRecord | null,
    setCurrentUser: (user: UserRecord) => void,
}

// This context contains a Provider component which makes the state available to all its children
export const AuthenticatedUserContext = createContext<AuthenticatedUserState>({
    currentUser: null,
    setCurrentUser: () => { },
})

// This is our custom Provider component in which we will wrap our application to provide the authenticated user state
export function AuthenticatedUserProvider({ children }: any) {
    const [currentUser, setCurrentUser] = useState<UserRecord | null>(null)

    // useCallback avoids redefining the same function
    const handleAuthenticationChange = useCallback(async function (_: string, model: BaseModel | null): Promise<void> {
        if (model === null) {
            // reset the currentUser state if noone is logged in
            setCurrentUser(null)
        } else {
            // fetch the record of the authenticated user and set the state
            const record: UserRecord = await pb.collection("users").getOne(model.id)
            setCurrentUser(record)
        }
    }, [])

    useEffect(() => {
        // whenever the currently authenticated user changes, update the currentUser state variable
        pb.authStore.onChange(handleAuthenticationChange)
        Promise.all([AsyncStorage.getItem(VAR_USERNAME), AsyncStorage.getItem(VAR_PASSWORD)])
            .then(([username, password]) => {
                if (username && password) {
                    pb.collection("users").authWithPassword(username, password)
                }
            }
            )
    }, [])

    const dummy: UserRecord = {
        "avatar": "0b96c15c_38e0_4a4f_85db_56a983fca616_eYP40cJivs.JPG",
        "collectionId": "_pb_users_auth_",
        "collectionName": "users",
        "created": "2023-03-21 17:41:31.147Z",
        "email": "c@gmail.com",
        "emailVisibility": false,
        "expand": {},
        "id": "0v5nlflehtbnnco",
        "name": "Moritz",
        "updated": "2023-06-05 11:41:39.104Z",
        "username": "momolino",
        "verified": false,
    } as UserRecord

    return (
        <AuthenticatedUserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthenticatedUserContext.Provider>
    )
}

// This enables us to get the current user with `const { currentUser } = useAuthenticatedUser()`
export function useAuthenticatedUser() {
    return useContext(AuthenticatedUserContext)
}   