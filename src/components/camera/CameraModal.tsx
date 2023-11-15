import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import { saveToLibraryAsync } from "expo-media-library";
import { useState } from "react";
import { Button, Image, Modal, SafeAreaView, StyleSheet, View } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { useDailyChallenges } from "src/store/DailyChallengesProvider";
import { FixedDimensionImage, PhotosRecord } from "types";
import { AppParamList } from "../LoggedInApp";
import ZoomableCamera from "./ZoomableCamera";

type CameraModalProps = {
    challengeName?: string,
    onClose?: () => void,
}

export default function CameraModal({ challengeName, onClose }: CameraModalProps) {
    const { currentUser } = useAuthenticatedUser()
    const { completeChallenge } = useDailyChallenges()

    const appNavigation = useNavigation<NavigationProp<AppParamList>>()

    const [photo, setPhoto] = useState<FixedDimensionImage>()

    function handleSkipPhoto(): void {
        if (onClose) onClose()
    }

    function handleUsePhoto(): void {
        if (photo === undefined) return
        uploadChallengePhoto().then((photoRecord: PhotosRecord) => {
            completeChallenge(challengeName!, photoRecord)
            saveToLibraryAsync(photo.uri) // We know that photo is not null at this point 
            if (onClose) onClose()
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
        formData.append("challenge_name", challengeName!) // We know that the challengeName can't be null at this point
        return pb.collection("photos").create<PhotosRecord>(formData)
    }

    return <Modal visible={challengeName !== undefined} animationType="slide">
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
                    <Button color={Colors.white} title="Maybe later" onPress={handleSkipPhoto} />
                    <Button color={Colors.white} title="Take another photo" onPress={() => setPhoto(undefined)} />
                    <Button color={Colors.white} title="Use photo" onPress={handleUsePhoto} />
                </View>
            </SafeAreaView>
        )}
    </Modal>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        justifyContent: "flex-end",
    },
    image: {
        resizeMode: "contain",
        width: "100%",
    },
    imageContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
})