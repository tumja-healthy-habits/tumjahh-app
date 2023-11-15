import PocketBase, { Record, RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { DependencyList, useEffect } from 'react'

const PB_URL: string = "http://tuzvhja-habits.srv.mwn.de/"
const pb: PocketBase = new PocketBase(PB_URL)

pb.autoCancellation(false)

export { pb }

type RecordActions<RecordType extends Record> = {
    onCreate?: (record: RecordType) => void,
    onDelete?: (record: RecordType) => void,
    onUpdate?: (record: RecordType) => void,
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