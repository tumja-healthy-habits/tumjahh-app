import { RouteProp, useRoute } from "@react-navigation/native";
import MosaicMemberList from "components/mosaic/MosaicMemberList";
import NewMosaicGridCopy from "components/mosaic/NewMosaicGridCopy";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { pb } from "src/pocketbaseService";
import { MosaicRecord } from "types";
import { MosaicParamList } from "./MosaicNavigator";

export default function NewMosaicScreen() {
    const { params } = useRoute<RouteProp<MosaicParamList, "SingleMosaic">>()
    const [mosaicRecord, setMosaicRecord] = useState<MosaicRecord>()

    useEffect(() => {
        pb.collection("mosaics").getOne<MosaicRecord>(params.mosaicId).then(setMosaicRecord).catch(console.error)
    }, [])

    return <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{mosaicRecord && mosaicRecord.name}</Text>
        {mosaicRecord ? (
            <>
                <MosaicMemberList mosaicRecord={mosaicRecord} />
                <NewMosaicGridCopy mosaicRecord={mosaicRecord} />
            </>
        ) : <ActivityIndicator />}
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 30,
        textAlign: "center",
        margin: 10,
    },
})