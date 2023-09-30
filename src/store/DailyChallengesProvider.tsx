import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { ChallengeData, ChallengesRecord, LocalStorageChallengeEntry, PhotosRecord } from "types";

export const VAR_CHALLENGES: string = "BeHealthyChallenges"

export type DailyChallenge = {
    challengeEntry: LocalStorageChallengeEntry,
    photo: PhotosRecord | null;
}

type DailyChallengesContext = {
    challenges: DailyChallenge[],
    addChallenge: (challenge: ChallengesRecord) => void,
    removeChallenge: (id: string) => void,
    completeChallenge: (name: string, photo: PhotosRecord) => void,
    setRepetitionGoal: (name: string, newGoal: number) => void,
}

const DailyChallengesContext = createContext<DailyChallengesContext>({
    challenges: [],
    addChallenge: () => { },
    removeChallenge: () => { },
    completeChallenge: () => { },
    setRepetitionGoal: () => { },
})

export default function DailyChallengesProvider({ children }: any) {
    const [challenges, setChallenges] = useState<DailyChallenge[]>([])

    // useEffect(() => {
    //     AsyncStorage.setItem(VAR_CHALLENGES, JSON.stringify({}))
    // }, [])

    // log the local storage data whenever challenges changes with useEffect
    useEffect(() => {
        // AsyncStorage.getItem(VAR_CHALLENGES).then((jsonString: string | null) => {
        //     jsonString && console.log("Local storage data:", JSON.stringify(JSON.parse(jsonString), null, 2))
        // })
        // console.log("\n\n\n\n\n", challenges)
    }, [challenges])



    useEffect(() => {
        AsyncStorage.getItem(VAR_CHALLENGES).then((jsonString: string | null) => {
            if (jsonString === null) {
                AsyncStorage.setItem(VAR_CHALLENGES, "{}")
                return
            }
            const challengeData: ChallengeData = JSON.parse(jsonString)
            const challenges: LocalStorageChallengeEntry[] = Object.values(challengeData).filter(entry => entry !== null) as LocalStorageChallengeEntry[]
            setChallenges(challenges.map((challengeEntry: LocalStorageChallengeEntry) => ({
                challengeEntry,
                photo: null,
            })))
        })
    }, [])

    function addChallenge(challenge: ChallengesRecord): void {
        const localStorageEntry: LocalStorageChallengeEntry = {
            record: challenge,
            repetitionsGoal: 1,
        }
        setChallenges((oldChallenges: DailyChallenge[]) => {
            const newChallenges: DailyChallenge[] = [...oldChallenges, {
                challengeEntry: localStorageEntry,
                photo: null,
            }]
            return newChallenges
        })
        AsyncStorage.mergeItem(VAR_CHALLENGES, JSON.stringify({
            [challenge.name]: localStorageEntry
        }))
    }

    function removeChallenge(name: string): void {
        setChallenges((oldChallenges: DailyChallenge[]) => {
            return oldChallenges.filter((dailyChallenge: DailyChallenge) => dailyChallenge.challengeEntry.record.name !== name)
        })
        console.log()
        AsyncStorage.mergeItem(VAR_CHALLENGES, JSON.stringify({
            [name]: null
        }))
    }

    function completeChallenge(name: string, photo: PhotosRecord): void {
        setChallenges((oldChallenges: DailyChallenge[]) => {
            const newChallenges = oldChallenges.map((dailyChallenge: DailyChallenge) => {
                if (dailyChallenge.challengeEntry.record.name !== name) return dailyChallenge
                return {
                    challengeEntry: dailyChallenge.challengeEntry,
                    photo,
                }
            })
            return newChallenges
        })
    }

    function setRepetitionGoal(name: string, newGoal: number): void {
        setChallenges((oldChallenges: DailyChallenge[]) => {
            const newChallenges = oldChallenges.map((dailyChallenge: DailyChallenge) => {
                if (dailyChallenge.challengeEntry.record.name !== name) return dailyChallenge
                return {
                    challengeEntry: {
                        ...dailyChallenge.challengeEntry,
                        repetitionsGoal: newGoal,
                    },
                    photo: dailyChallenge.photo,
                }
            })
            return newChallenges
        })
        AsyncStorage.mergeItem(VAR_CHALLENGES, JSON.stringify({
            [name]: {
                repetitionsGoal: newGoal,
            }
        }))
    }

    return (
        <DailyChallengesContext.Provider value={{ challenges, addChallenge, completeChallenge, removeChallenge, setRepetitionGoal }}>
            {children}
        </DailyChallengesContext.Provider>
    )
}

export function useDailyChallenges() {
    return useContext(DailyChallengesContext)
}