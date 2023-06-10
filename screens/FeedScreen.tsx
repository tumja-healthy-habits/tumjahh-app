import { useIsFocused } from "@react-navigation/native";
import Colors from "constants/colors";
import { Camera, CameraCapturedPicture } from "expo-camera"
import { useState } from "react";
import { Button, StyleSheet, Text, View, Image, Alert } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import ZoomableCamera from "components/ZoomableCamera";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function FeedScreen() {

    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [photo, setPhoto] = useState<CameraCapturedPicture>()
    const { currentUser } = useAuthenticatedUser()
    const focused: boolean = useIsFocused()

    if (currentUser === null) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>You need to be logged in to use this feature</Text>
            </View>
        )
    }

    if (!focused) {
        return <View />
    }

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    async function sendPhoto() {
        if (!photo || !currentUser) return
        const formData: FormData = new FormData()
        formData.append('photo', {
            uri: photo.uri,
            name: photo.uri,
            type: "image/jpg"
        })
        formData.append("user_id", currentUser.id)
        formData.append("width", photo.width.toString())
        formData.append("height", photo.height.toString())
        pb.collection("photos").create(formData)
            .then(() => Alert.alert("Foto wurde hochgeladen!"))
            .catch((e: any) => console.log(JSON.stringify(e)))
    }

    if (photo) return (
        <View style={styles.container}>
            <Image source={{ uri: photo.uri }} style={styles.image} />
            <Button color={Colors.accent} title="Send photo" onPress={sendPhoto} />
            <Button color={Colors.accent} title="Take another photo" onPress={() => setPhoto(undefined)} />
        </View>
    )

    return (
        <GestureHandlerRootView style={styles.container}>
            <ZoomableCamera onTakePhoto={setPhoto} />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.pastelViolet,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    }
});