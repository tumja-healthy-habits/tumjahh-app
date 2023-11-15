import MosaicPreview from "components/mosaic/MosaicPreview";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, SafeAreaView, StyleSheet } from "react-native";
import { pb, useRealTimeSubscription } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { MosaicMembersRecord, MosaicRecord } from "types";

export default function () {
    const { currentUser } = useAuthenticatedUser()
    const [mosaics, setMosaics] = useState<MosaicRecord[]>([])

    useRealTimeSubscription<MosaicMembersRecord>("mosaic_members", {
        onCreate: handleCreateMosaicMember,
        onDelete: handleDeleteMosaicMember,
    }, [])

    useEffect(() => {
        // load all mosaics that the user is a member of
        pb.collection("mosaics").getFullList<MosaicRecord>().then(setMosaics).catch(console.error)
    }, [])

    function handleCreateMosaicMember(record: MosaicMembersRecord): void {
        if (record.user_id === currentUser!.id) {
            // add the mosaic that the user joined to the list of mosaics
            pb.collection("mosaics").getOne<MosaicRecord>(record.mosaic_id).then((mosaic: MosaicRecord) => {
                setMosaics((oldMosaics: MosaicRecord[]) => {
                    if (oldMosaics.some((mosaic: MosaicRecord) => mosaic.id === record.mosaic_id)) {
                        console.log("mosaic already exists")
                        return oldMosaics
                    }
                    return [...oldMosaics, mosaic]
                })
            }).catch(console.error)
        }
    }

    function handleDeleteMosaicMember(record: MosaicMembersRecord): void {
        if (record.user_id === currentUser!.id) {
            // remove the mosaic that the user left from the list of mosaics
            setMosaics((oldMosaics: MosaicRecord[]) => {
                if (!oldMosaics.some((mosaic: MosaicRecord) => mosaic.id === record.mosaic_id)) {
                    console.log("mosaic does not exist")
                    return oldMosaics
                }
                return oldMosaics.filter((mosaic: MosaicRecord) => mosaic.id !== record.mosaic_id)
            })
        }
    }

    return <SafeAreaView style={styles.container}>
        <FlatList
            data={mosaics}
            renderItem={(info: ListRenderItemInfo<MosaicRecord>) => <MosaicPreview record={info.item} />}
            keyExtractor={(mosaic: MosaicRecord) => mosaic.id}
            style={{ backgroundColor: Colors.backgroundProfile }}
        />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
})