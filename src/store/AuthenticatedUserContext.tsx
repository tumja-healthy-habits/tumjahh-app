import { BaseModel } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserRecord } from "types";

type AuthenticatedUserState = {
    currentUser: UserRecord | null,
    setCurrentUser: (user: UserRecord) => void,
}

const AuthenticatedUserContext = createContext<AuthenticatedUserState>({
    currentUser: null,
    setCurrentUser: () => { },
})

export function AuthenticatedUserProvider({ children }: any) {
    const [currentUser, setCurrentUser] = useState<UserRecord | null>(null)

    // useCallback avoids redefining the same function
    const handleAuthenticationChange = useCallback(async function (_: string, model: BaseModel | null): Promise<void> {
        if (model === null) {
            setCurrentUser(null)
        } else {
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

export function useAuthenticatedUser() {
    return useContext(AuthenticatedUserContext)
}   