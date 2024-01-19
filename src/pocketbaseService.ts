import PocketBase, { Record, RecordFullListQueryParams, RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { DependencyList, useEffect, useState } from 'react'

const PB_URL: string = "http://tuzvhja-habits.srv.mwn.de/"
const pb: PocketBase = new PocketBase(PB_URL)

pb.autoCancellation(false)

export { pb }

type RecordActions<RecordType extends Record> = {
    onCreate?: (record: RecordType) => void
    onDelete?: (record: RecordType) => void
    onUpdate?: (record: RecordType) => void
}

export function useRealTimeSubscription<RecordType extends Record>(collection: string, { onCreate, onDelete, onUpdate }: RecordActions<RecordType>, dependencies: DependencyList) {

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
        }).catch(console.error)
        return () => {
            if (cleanup) {
                console.log(`Unsubscribed from realtime updates from collection "${collection}"`)
                cleanup()
            }
        }
    }, dependencies)
}

export function useRealTimeCollection<RecordType extends Record>(collection: string, dependencies: DependencyList, params?: RecordFullListQueryParams): RecordType[] {
    const [records, setRecords] = useState<RecordType[]>([])

    useEffect(() => {
        pb.collection(collection).getFullList<RecordType>(params)
            .then(setRecords).catch(console.error)
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
            pb.collection(collection).getOne<RecordType>(record.id, params).then(addRecord).catch(console.error)
        },
        onDelete: deleteRecord,
        onUpdate: (record: RecordType) => {
            pb.collection(collection).getOne<RecordType>(record.id, params).then(updateRecord).catch(console.error)
        }
    } : {
        onCreate: addRecord,
        onDelete: deleteRecord,
        onUpdate: updateRecord
    }

    useRealTimeSubscription<RecordType>(collection, actions, dependencies)

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