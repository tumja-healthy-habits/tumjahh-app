import { createContext, useContext } from "react";
import { useRealTimeCollection } from "src/pocketbaseService";
import { FriendsWithRecord, UserRecord } from "types";
import { useAuthenticatedUser } from "./AuthenticatedUserProvider";

type FriendsContext = UserRecord[]

const FriendsContext = createContext<FriendsContext>([])

export default function FriendsProvider({ children }: any) {
    const { currentUser } = useAuthenticatedUser()
    const friends: UserRecord[] = useRealTimeCollection<FriendsWithRecord>("friends_with", [], {
        expand: "user1, user2"
    }).map((record: FriendsWithRecord) => {
        if (currentUser === null) throw new Error("Current user is null")
        return record.user1 === currentUser.id ? record.expand.user2 : record.expand.user1
    })

    return <FriendsContext.Provider value={friends}>
        {children}
    </FriendsContext.Provider>
}

export function useFriends() {
    return useContext(FriendsContext)
}