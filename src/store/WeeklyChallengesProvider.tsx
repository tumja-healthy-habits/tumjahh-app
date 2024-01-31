import { createContext, useContext, useEffect, useState } from "react";
import { createWeeklyChallengeRecord, lastSundayMidnight, pb, useRealTimeSubscription } from "src/pocketbaseService";
import { WeeklyChallengesRecord } from "types";
import { useAuthenticatedUser } from "./AuthenticatedUserProvider";

type WeeklyChallengesStore = WeeklyChallengesRecord[]

export const WeeklyChallengesContext = createContext<WeeklyChallengesStore>([])

export default function WeeklyChallengesProvider({ children }: any) {
    const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallengesRecord[]>([])
    const { currentUser } = useAuthenticatedUser()

    useRealTimeSubscription<WeeklyChallengesRecord>("weekly_challenges", {
        onCreate: (record: WeeklyChallengesRecord) => {
            pb.collection("weekly_challenges").getOne<WeeklyChallengesRecord>(record.id, { expand: "challenge_id" }).then(record => {
                setWeeklyChallenges((oldChallenges: WeeklyChallengesRecord[]) => [...oldChallenges, record])
            })
        },
        onDelete: (record: WeeklyChallengesRecord) => {
            setWeeklyChallenges((oldChallenges: WeeklyChallengesRecord[]) => oldChallenges.filter((challenge: WeeklyChallengesRecord) => challenge.id !== record.id))
        },
        onUpdate: (record: WeeklyChallengesRecord) => {
            pb.collection("weekly_challenges").getOne<WeeklyChallengesRecord>(record.id, { expand: "challenge_id" }).then(record => {
                setWeeklyChallenges((oldChallenges: WeeklyChallengesRecord[]) => oldChallenges.map((challenge: WeeklyChallengesRecord) => challenge.id === record.id ? record : challenge))
            })
        }
    })

    async function fetchWeeklyChallenges() {
        if (currentUser === null) return
        const allRecords: WeeklyChallengesRecord[] = await pb.collection("weekly_challenges").getFullList<WeeklyChallengesRecord>({
            sort: "-start_date",
        })
        if (allRecords.length === 0) return
        const startDate: string = allRecords[0].start_date
        const records: WeeklyChallengesRecord[] = await pb.collection("weekly_challenges").getFullList<WeeklyChallengesRecord>({
            filter: `start_date >= "${startDate}"`,
            expand: "challenge_id",
        })
        setWeeklyChallenges(records)
        if (new Date().getTime() - new Date(startDate).getTime() < 7 * 24 * 60 * 60 * 1000) return

        await Promise.all(records.map((record: WeeklyChallengesRecord) =>
            createWeeklyChallengeRecord(record.expand.challenge_id.id, currentUser.id)
        ))
        pb.collection("weekly_challenges").getFullList<WeeklyChallengesRecord>({
            filter: `start_date >= "${lastSundayMidnight()}"`,
            expand: "challenge_id",
        }).then(setWeeklyChallenges)
    }

    useEffect(() => {
        fetchWeeklyChallenges()
    }, [])


    return <WeeklyChallengesContext.Provider value={weeklyChallenges}>
        {children}
        {/* <WeeklyChallengeModal visible={showModal} onClose={() => setShowModal(false)} /> */}
    </WeeklyChallengesContext.Provider>
}


export function useWeeklyChallenges(): WeeklyChallengesStore {
    return useContext(WeeklyChallengesContext)
}