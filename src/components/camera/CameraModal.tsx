import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import { saveToLibraryAsync } from "expo-media-library";
import { useState } from "react";
import { Button, Image, Modal, SafeAreaView, StyleSheet, View } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { FixedDimensionImage, PhotosRecord, WeeklyChallengesRecord } from "types";
import { AppParamList } from "../LoggedInApp";
import ZoomableCamera from "./ZoomableCamera";

type CameraModalProps = {
    weeklyChallenge?: WeeklyChallengesRecord,
    onClose?: () => void,
}

export default function CameraModal({ weeklyChallenge, onClose }: CameraModalProps) {
    const { currentUser } = useAuthenticatedUser()

    const appNavigation = useNavigation<NavigationProp<AppParamList>>()

    const [photo, setPhoto] = useState<FixedDimensionImage>()

    function completeChallenge(usedPhoto: boolean): void {
        if (weeklyChallenge === undefined) return
        pb.collection("weekly_challenges").update<WeeklyChallengesRecord>(weeklyChallenge.id, {
            last_completed: new Date(),
            amount_accomplished: weeklyChallenge.amount_accomplished + 1,
            amount_photos: weeklyChallenge.amount_photos + (usedPhoto ? 1 : 0),
        }).then(() => {
            if (onClose !== undefined) onClose()
        })
            .catch((error) => console.log("An error occurred while trying to complete a challenge: ", error))
    }

    function handleSkipPhoto(): void {
        completeChallenge(false)
    }

    function handleUsePhoto(): void {
        if (photo === undefined || weeklyChallenge === undefined) return
        uploadChallengePhoto().then((photoRecord: PhotosRecord) => {
            saveToLibraryAsync(photo.uri) // We know that photo is not null at this point 
            completeChallenge(true)
            appNavigation.navigate("Mosaic", {
                photoId: photoRecord.id,
            })
        }).finally(() => setPhoto(undefined))
    }

    function uploadChallengePhoto(): Promise<PhotosRecord> {
        const formData: FormData = new FormData()
        formData.append('photo', {
            uri: photo!.uri,
            name: photo!.uri,
            type: "image/jpg"
        } as any)
        formData.append("user_id", currentUser!.id)
        formData.append("width", photo!.width.toString())
        formData.append("height", photo!.height.toString())
        return pb.collection("photos").create<PhotosRecord>(formData)
    }

    return <Modal visible={weeklyChallenge !== undefined} animationType="slide">
        {photo === undefined ? (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: Colors.pastelViolet,
            }}>
                <ZoomableCamera onTakePhoto={setPhoto} />
            </View>
        ) : (
            <SafeAreaView style={styles.container}>
                <View style={styles.imageContainer} >
                    <Image source={{ uri: photo.uri }} style={[styles.image, { aspectRatio: photo.width / photo.height }]} />
                </View>
                <View style={styles.buttonContainer} >
                    <Button color={Colors.white} title={"Maybe\n later"} onPress={handleSkipPhoto} />
                    <Button color={Colors.white} title={"Try\n again"} onPress={() => setPhoto(undefined)} />
                    <Button color={Colors.white} title={"Use\n photo"} onPress={handleUsePhoto} />
                </View>
            </SafeAreaView>
        )}
    </Modal>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        justifyContent: "space-evenly",
    },
    image: {
        resizeMode: "contain",
        width: "100%",
    },
    imageContainer: {
        //flex: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },
})