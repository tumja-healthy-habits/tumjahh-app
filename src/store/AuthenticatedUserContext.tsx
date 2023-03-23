import { BaseModel } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { createContext, useContext, useEffect, useState } from "react";

type AuthenticatedUserState = {
    currentUser: BaseModel | null,
}

const AuthenticatedUserContext = createContext<AuthenticatedUserState>({
    currentUser: null,
})

export function AuthenticatedUserProvider({ children }: any) {
    const [currentUser, setCurrentUser] = useState<BaseModel | null>(null)

    useEffect(() => {
        // whenever the currently authenticated user changes, update the currentUser state variable
        pb.authStore.onChange((_: string, model: BaseModel | null) => setCurrentUser(model))
    }, [])

    return (
        <AuthenticatedUserContext.Provider value={{ currentUser }}>
            {children}
        </AuthenticatedUserContext.Provider>
    )
}

export function useAuthenticatedUser() {
    return useContext(AuthenticatedUserContext)
}   