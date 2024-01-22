import { createContext, useContext } from "react";
import { useRealTimeCollection } from "src/pocketbaseService";
import { WeeklyChallengesRecord } from "types";

function oneWeekAgo(): string {
    const date: Date = new Date()
    date.setUTCDate(date.getUTCDate() - 7)
    return date.toISOString().replace("T", " ")
}

type WeeklyChallengesStore = WeeklyChallengesRecord[]

export const WeeklyChallengesContext = createContext<WeeklyChallengesStore>([])

export default function WeeklyChallengesProvider({ children }: any) {
    const weeklyChallenges = useRealTimeCollection<WeeklyChallengesRecord>("weekly_challenges", [], {
        expand: "challenge_id",
        filter: `created > "${oneWeekAgo()}"`,
    })

    return <WeeklyChallengesContext.Provider value={weeklyChallenges}>
        {children}
    </WeeklyChallengesContext.Provider>
}

export function useWeeklyChallenges(): WeeklyChallengesStore {
    return useContext(WeeklyChallengesContext)
}