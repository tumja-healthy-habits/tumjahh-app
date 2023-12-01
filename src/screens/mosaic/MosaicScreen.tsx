import { RouteProp, useRoute } from "@react-navigation/native";
import InputField from "components/authentication/InputField";
import BlurModal from "components/misc/BlurModal";
import MosaicMemberList from "components/mosaic/MosaicMemberList";
import NewMosaicGridCopy from "components/mosaic/NewMosaicGrid";
import ProfilePicture from "components/profile/ProfilePicture";
import { ImagePickerResult, MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { useEffect, useState } from "react";
import { Button, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { pb } from "src/pocketbaseService";
import { MosaicRecord } from "types";
import { MosaicParamList } from "./MosaicNavigator";

export default function NewMosaicScreen() {
    const { params } = useRoute<RouteProp<MosaicParamList, "SingleMosaic">>()
    const [mosaicRecord, setMosaicRecord] = useState<MosaicRecord>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [name, setName] = useState<string>(mosaicRecord ? mosaicRecord.name : "")

    console.log("mosaic record", mosaicRecord)

    useEffect(() => {
        pb.collection("mosaics").getOne<MosaicRecord>(params.mosaicId).then(setMosaicRecord).catch(console.error)
    }, [])

    async function handleTapProfilePicture(): Promise<void> {
        launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            allowsMultipleSelection: false,
            aspect: [1, 1],
        }).then((result: ImagePickerResult) => {
            if (result.canceled) return
            if (mosaicRecord === undefined) return
            const updateData: FormData = new FormData()
            updateData.append("thumbnail", {
                uri: result.assets[0].uri,
                name: result.assets[0].uri,
                type: "image/jpg"
            } as any)
            pb.collection("mosaics").update<MosaicRecord>(mosaicRecord.id, updateData).then(setMosaicRecord).catch(console.error)
        })
    }

    return <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.title}>{mosaicRecord && mosaicRecord.name}</Text>
            <View style={styles.button}><Button onPress={() => setShowModal(true)} title="Edit" /></View>
        </View>
        <Divider />
        {mosaicRecord ? (
            <>
                <MosaicMemberList mosaicRecord={mosaicRecord} />
                <View style={{
                    //  borderColor: "red", borderWidth: 2,
                    flex: 1
                }}>
                    <NewMosaicGridCopy mosaicRecord={mosaicRecord} />
                </View>
            </>
        ) : <ActivityIndicator />}
        <BlurModal visible={showModal} onClose={() => {
            setShowModal(false)
            if (mosaicRecord === undefined || name === mosaicRecord.name) return
            pb.collection("mosaics").update<MosaicRecord>(mosaicRecord?.id, { name }).then(setMosaicRecord).catch(console.error)
        }}>
            <View style={styles.modalContainer}>
                <Pressable onPress={handleTapProfilePicture}>
                    {mosaicRecord && <ProfilePicture uri={pb.getFileUrl(mosaicRecord, mosaicRecord.thumbnail)} style={styles.thumbnail} />}
                </Pressable>
                <InputField label="Mosaic Name" onChangeText={setName} value={name} />
            </View>
        </BlurModal>
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
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        position: "absolute",
        right: 0,
        margin: 10,
    },
    thumbnail: {
        width: 200,
        height: 200,
        borderRadius: 8,
        margin: 40,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        alignSelf: "center",
    },
})