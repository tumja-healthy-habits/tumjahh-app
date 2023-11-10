import { RecordSubscription, UnsubscribeFunc } from "pocketbase";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { MosaicMembersRecord, MosaicRecord } from "types";

export default function () {
    const { currentUser } = useAuthenticatedUser()
    const [mosaics, setMosaics] = useState<MosaicRecord[]>([])

    useEffect(() => {
        let cleanup: () => void | undefined
        // load all mosaics that the user is a member of
        pb.collection("mosaics").getFullList<MosaicRecord>().then(setMosaics).catch(console.error)

        // subscribe to changes in the user's membership of mosaics
        pb.collection("mosaic_members").subscribe<MosaicMembersRecord>("*", ({ action, record }: RecordSubscription<MosaicMembersRecord>) => {
            console.log("mosaic member change:", action, record)
            switch (action) {
                case "create":
                    if (record.user_id === currentUser!.id) {
                        // add the mosaic that the user joined to the list of mosaics
                        pb.collection("mosaics").getOne<MosaicRecord>(record.mosaic_id).then((mosaic: MosaicRecord) => {
                            setMosaics((oldMosaics: MosaicRecord[]) => {
                                if (oldMosaics.some((mosaic: MosaicRecord) => mosaic.id === record.mosaic_id)) {
                                    console.log("mosaic already exists")
                                    return oldMosaics
                                }
                                console.log("added mosaic")
                                return [...oldMosaics, mosaic]
                            })
                        }).catch(console.error)
                    }
                    break
                case "delete":
                    if (record.user_id === currentUser!.id) {
                        // remove the mosaic that the user left from the list of mosaics
                        setMosaics((oldMosaics: MosaicRecord[]) => {
                            if (!mosaics.some((mosaic: MosaicRecord) => mosaic.id === record.mosaic_id)) {
                                console.log("mosaic does not exist")
                                return oldMosaics
                            }
                            console.log("removed mosaic")
                            return oldMosaics.filter((mosaic: MosaicRecord) => mosaic.id !== record.mosaic_id)
                        })
                    }
                    break
            }
        }).then((unsubscribe: UnsubscribeFunc) => {
            console.log("Subscribed to mosaic member changes")
            // cleanup function that is called when the component is unomunted
            cleanup = () => {
                console.log("Removed mosaic member subscription")
                unsubscribe()
            }
        }).catch(console.error)

        // return the cleanup function
        return () => {
            if (cleanup) {
                cleanup()
            }
        }
    }, [])

    return <View>
        {mosaics.map(mosaic => <View key={mosaic.id}>
            <Text>{mosaic.name}</Text>
        </View>)}
    </View>
}