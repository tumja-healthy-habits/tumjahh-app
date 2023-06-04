import Colors from "constants/colors";
import { ImagePickerAsset, ImagePickerResult, launchCameraAsync, PermissionResponse, useCameraPermissions } from "expo-image-picker";
import { useState } from "react";
import { Button, StyleSheet, Text, View, Image, Alert } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import { PhotosRecord } from "types";

export default function FeedScreen() {
    const [status, requestPermission] = useCameraPermissions()
    const [photo, setPhoto] = useState<ImagePickerAsset | null>(null)
    const { currentUser } = useAuthenticatedUser()

    async function handleClickCameraButton() {
        console.log("Status: ", status)
        if (!status?.granted) {
            // If the permission is not granted yet, ask for it
            const response: PermissionResponse = await requestPermission()
            if (!response.granted) {
                Alert.alert("Camera permission required", "In order to use Healthy Habits to its full potential, you need to share photos with your friends")
                return
            }
        }
        // at this point, we have the permission
        const result: ImagePickerResult = await launchCameraAsync()
        console.log(result)
        setPhoto(result.assets && result.assets[0])
    }

    async function handleClickSendPhoto() {
        console.log("handling click send photo!", photo, currentUser)
        if (!photo || !currentUser) return
        const formData: FormData = new FormData()
        console.log("so far, it works")
        formData.append('photo', {
            uri: photo.uri,
            name: photo.fileName || "new photo",
            type: photo.type || "image",
        })
        console.log("appended file")
        formData.set("user_id", currentUser.id)
        console.log(formData)
        await pb.collection("photos").create<PhotosRecord>(formData)
        Alert.alert("Foto wurde hochgeladen!")
    }

    return (
        <View style={styles.container}>
            <Text style={{ color: Colors.accent, fontSize: 40 }}>Your Feed</Text>
            {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
            <Button color={Colors.accent} title={photo ? "Take another photo" : "Take photo"} onPress={handleClickCameraButton} />
            <Button color={Colors.accent} title="Send photo" onPress={handleClickSendPhoto} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: Colors.primary,
        margin: 10,
    }
})