import { useIsFocused } from "@react-navigation/native";
import Colors from "constants/colors";
import { Camera, CameraType, CameraCapturedPicture } from "expo-camera"
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, View, Image, Alert, TouchableOpacity } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";

const IMAGE_QUALITY: number = 0.9 // from 0 lowest to 1 highest quality

export default function FeedScreen() {

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null)
    const { currentUser } = useAuthenticatedUser()
    const cameraRef = useRef<Camera>(null)
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

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    async function takePhoto() {
        if (cameraRef.current === null) return
        const photo: CameraCapturedPicture | undefined = await cameraRef.current.takePictureAsync({
            quality: IMAGE_QUALITY
        })
        if (photo) {
            console.log("This is the photo:", photo)
            setPhoto(photo)
        }
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

    return (
        <View style={styles.container}>
            {photo ? <>
                <Image source={{ uri: photo.uri }} style={styles.image} />
                <Button color={Colors.accent} title="Send photo" onPress={sendPhoto} />
                <Button color={Colors.accent} title="Take another photo" onPress={() => setPhoto(null)} />
            </>
                :
                <Camera style={styles.camera} type={type} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                        <Button onPress={takePhoto} title="Take Photo" />
                    </View>
                </Camera>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    }
});