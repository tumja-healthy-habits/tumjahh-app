import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import InputField from "components/authentication/InputField";
import BlurModal from "components/misc/BlurModal";
import IconButton from "components/misc/IconButton";
import MosaicMemberList from "components/mosaic/MosaicMemberList";
import NewMosaicGridCopy from "components/mosaic/NewMosaicGrid";
import ProfilePicture from "components/profile/ProfilePicture";
import Colors from "constants/colors";
import { ImagePickerResult, MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { pb } from "src/pocketbaseService";
import { useMosaics } from "src/store/MosaicsProvider";
import { MosaicRecord } from "types";
import { MosaicParamList } from "./MosaicNavigator";

export default function NewMosaicScreen() {
    const { mosaicId } = useRoute<RouteProp<MosaicParamList, "SingleMosaic">>().params
    const mosaics: MosaicRecord[] = useMosaics()
    const mosaicRecord: MosaicRecord | undefined = mosaics.find((mosaic: MosaicRecord) => mosaic.id === mosaicId)
    console.log(mosaicRecord, mosaicId)
    const { navigate, goBack } = useNavigation<NavigationProp<MosaicParamList, "SingleMosaic">>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [name, setName] = useState<string>(mosaicRecord ? mosaicRecord.name : "")

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
            pb.collection("mosaics").update<MosaicRecord>(mosaicRecord.id, updateData)
        })
    }

    return <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <IconButton icon="chevron-back-outline" onPress={goBack} color="#666" size={30} style={styles.backButton} />
            <Text style={styles.title}>{mosaicRecord && mosaicRecord.name}</Text>
            <IconButton icon="create-outline" color="#666" size={30} onPress={() => navigate("EditMosaic", { mosaicId: mosaicId })} style={styles.editButton} />
        </View>
        <Divider />
        {mosaicRecord ? (
            <>
                <MosaicMemberList mosaicRecord={mosaicRecord} />
                <View style={{ flex: 1 }}>
                    <NewMosaicGridCopy mosaicRecord={mosaicRecord} />
                </View>
            </>
        ) : <ActivityIndicator />}
        <BlurModal visible={showModal} onClose={() => {
            setShowModal(false)
            if (mosaicRecord === undefined || name === mosaicRecord.name) return
            pb.collection("mosaics").update<MosaicRecord>(mosaicRecord?.id, { name })
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
        backgroundColor: Colors.backgroundProfile
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
    backButton: {
        position: "absolute",
        left: 0,
        margin: 10
    },
    editButton: {
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