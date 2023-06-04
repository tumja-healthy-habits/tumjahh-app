import { BaseModel } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserRecord } from "types";

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
    }, [])

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