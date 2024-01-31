import PocketBase, { Record, RecordFullListQueryParams, RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { DependencyList, useEffect, useState } from 'react'
import { WeeklyChallengesRecord } from 'types'

const PB_URL: string = "http://tuzvhja-habits.srv.mwn.de/"
const pb: PocketBase = new PocketBase(PB_URL)

pb.autoCancellation(false)

export { pb }

export function lastSundayMidnight(): string {
    let d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - d.getDay())
    return d.toISOString().replace("T", " ")
}

export function createWeeklyChallengeRecord(challengeId: string, userId: string): Promise<WeeklyChallengesRecord | void> {
    return pb.collection("weekly_challenges").create<WeeklyChallengesRecord>({
        user_id: userId,
        challenge_id: challengeId,
        amount_accomplished: 0,
        amount_photos: 0,
        amount_planned: 1,
        last_completed: "1970-01-01 00:00:00",
        start_date: lastSundayMidnight(),
    }).catch(error => console.error("Failed to create weekly challenge record", error))
}

type RecordActions<RecordType extends Record> = {
    onCreate?: (record: RecordType) => void
    onDelete?: (record: RecordType) => void
    onUpdate?: (record: RecordType) => void
}

export function useRealTimeSubscription<RecordType extends Record>(collection: string, { onCreate, onDelete, onUpdate }: RecordActions<RecordType>) {

    let cleanup: () => void | undefined

    useEffect(() => {
        pb.collection(collection).subscribe<RecordType>("*", ({ action, record }: RecordSubscription<RecordType>) => {
            console.log("Realtime update", action, record)
            switch (action) {
                case "create":
                    onCreate && onCreate(record)
                    break
                case "delete":
                    onDelete && onDelete(record)
                    break
                case "update":
                    onUpdate && onUpdate(record)
                    break
            }
        }).then((unsubscribe: UnsubscribeFunc) => {
            console.log(`Subscribed to realtime updates from collection "${collection}"`)
            cleanup = () => {
                unsubscribe()
            }
        }).catch(error => console.error("Failed to subscribe to realtime updates", error))
        return () => {
            if (cleanup) {
                console.log(`Unsubscribed from realtime updates from collection "${collection}"`)
                cleanup()
            }
        }
    }, [])
}

export function useRealTimeCollection<RecordType extends Record>(collection: string, dependencies: DependencyList, params?: RecordFullListQueryParams): RecordType[] {
    const [records, setRecords] = useState<RecordType[]>([])

    useEffect(() => {
        pb.collection(collection).getFullList<RecordType>(params)
            .then(setRecords).catch(error => console.error("Failed to get full list", error))
    }, dependencies)

    function addRecord(record: RecordType) {
        setRecords((records: RecordType[]) => [...records, record])
    }

    function deleteRecord(record: RecordType) {
        setRecords((records: RecordType[]) => records.filter((r: RecordType) => r.id !== record.id))
    }

    function updateRecord(record: RecordType) {
        setRecords((records: RecordType[]) => records.map((r: RecordType) => r.id === record.id ? record : r))
    }

    const actions: RecordActions<RecordType> = params && params.expand ? {
        onCreate: (record: RecordType) => {
            pb.collection(collection).getOne<RecordType>(record.id, params).then(addRecord).catch(error => console.error("Failed to get record after creation", error))
        },
        onDelete: deleteRecord,
        onUpdate: (record: RecordType) => {
            pb.collection(collection).getOne<RecordType>(record.id, params).then(updateRecord).catch(error => console.error("Failed to get record after update", error))
        }
    } : {
        onCreate: addRecord,
        onDelete: deleteRecord,
        onUpdate: updateRecord,
    }

    useRealTimeSubscription<RecordType>(collection, actions)

    return records
}

export function useCollection<RecordType extends Record>(collection: string, dependencies: DependencyList, params?: RecordFullListQueryParams): RecordType[] {
    const [records, setRecords] = useState<RecordType[]>([])

    useEffect(() => {
        pb.collection(collection).getFullList<RecordType>(params)
            .then(setRecords).catch(console.error)
    }, dependencies)

    return records
}