import WeeklyChallengeModal from "components/challenges/WeeklyChallengeModal";
import { createContext, useContext, useEffect, useState } from "react";
import { createWeeklyChallengeRecord, lastSundayMidnight, pb, useRealTimeCollection } from "src/pocketbaseService";
import { WeeklyChallengesRecord } from "types";
import { useAuthenticatedUser } from "./AuthenticatedUserProvider";

type WeeklyChallengesStore = WeeklyChallengesRecord[]

export const WeeklyChallengesContext = createContext<WeeklyChallengesStore>([])

export default function WeeklyChallengesProvider({ children }: any) {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().replace("T", " "))
    const { currentUser } = useAuthenticatedUser()

    const weeklyChallenges: WeeklyChallengesRecord[] = useRealTimeCollection<WeeklyChallengesRecord>("weekly_challenges", [startDate], {
        expand: "challenge_id",
        filter: `start_date >= "${startDate}"`,
        sort: "+start_date",
    })

    // useEffect(() => {
    //     pb.collection("weekly_challenges").getFullList<WeeklyChallengesRecord>().then((records: WeeklyChallengesRecord[]) => {
    //         records.forEach((record: WeeklyChallengesRecord) => {
    //             pb.collection("weekly_challenges").delete(record.id)
    //         })
    //     })
    // }, [])

    useEffect(() => {
        if (currentUser === null) return
        pb.collection("weekly_challenges").getFullList<WeeklyChallengesRecord>({
            sort: "-start_date",
        }).then((records: WeeklyChallengesRecord[]) => {
            if (records.length === 0) return
            console.log("last weekly challenge", records[0])
            setStartDate(records[0].start_date)
        }).catch((error: Error) => console.error("Error getting last weekly challenge", error))
    }, [])

    useEffect(() => {
        console.log("useEffect in weekly challenges provider, weekly challenges", weeklyChallenges, startDate)
        if (weeklyChallenges.length === 0) return
        if (currentUser === null) return
        const today: Date = new Date()
        const start: Date = new Date(weeklyChallenges[0].start_date)
        console.log("today", today, "start date", start, "diff", (today.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))

        if (today.getTime() - start.getTime() >= 7 * 24 * 60 * 60 * 1000) {
            setShowModal(true)
            console.log("creating weekly challenges", weeklyChallenges.map((e: WeeklyChallengesRecord) => e.expand.challenge_id.name))
            Promise.all(weeklyChallenges.map(
                (weeklyChallenge: WeeklyChallengesRecord) => createWeeklyChallengeRecord(weeklyChallenge.expand.challenge_id.id, currentUser.id)
            ))
            console.log("setting start date to last sunday", lastSundayMidnight())
            setStartDate(lastSundayMidnight())
        }
    }, [startDate])

    console.log("weekly challenges", weeklyChallenges.map((e: WeeklyChallengesRecord) => e.expand.challenge_id.name))

    return <WeeklyChallengesContext.Provider value={weeklyChallenges}>
        {children}
        <WeeklyChallengeModal visible={showModal} onClose={() => setShowModal(false)} />
    </WeeklyChallengesContext.Provider>
}

export function useWeeklyChallenges(): WeeklyChallengesStore {
    return useContext(WeeklyChallengesContext)
}