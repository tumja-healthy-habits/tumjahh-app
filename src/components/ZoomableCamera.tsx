import { Camera, CameraCapturedPicture, CameraType } from "expo-camera"
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, GestureStateChangeEvent, GestureUpdateEvent, PinchGesture, PinchGestureHandlerEventPayload } from "react-native-gesture-handler";
import IconButton from "./IconButton";
import Colors from "constants/colors";

type ZoomableCameraProps = {
    onTakePhoto: (photo: CameraCapturedPicture) => void,
}

const IMAGE_QUALITY: number = 0.9 // from 0 lowest to 1 highest quality
const ZOOM_SPEED: number = 0.003 // the smaller the slower
const MAX_ZOOM_CAMERA: number = 0.2

export default function ZoomableCamera({ onTakePhoto }: ZoomableCameraProps) {
    const [type, setType] = useState(CameraType.back);
    const cameraRef = useRef<Camera>(null)
    const [scale, setScale] = useState<number>(1)
    const [savedScale, setSavedScale] = useState<number>(1)

    useEffect(() => {
        setScale(1)
    }, [type])

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    async function takePhoto(): Promise<void> {
        if (cameraRef.current === null) return
        cameraRef.current.takePictureAsync({
            quality: IMAGE_QUALITY
        }).then(onTakePhoto)
    }

    const pinchGesture: PinchGesture = Gesture.Pinch().onUpdate((event: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
        const newScale: number = Math.max(1, Math.min(scale * event.scale, MAX_ZOOM_CAMERA / ZOOM_SPEED))
        setScale(newScale)
    }).onEnd((event: GestureStateChangeEvent<PinchGestureHandlerEventPayload>) => {
        setSavedScale(scale)
    })

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={pinchGesture}>
                <Camera style={styles.camera} type={type} ref={cameraRef} zoom={ZOOM_SPEED * (scale - 1)}>
                    <View style={styles.upwardsContainer}>
                        <View style={styles.buttonContainer}>
                            <View style={styles.button} />
                            <IconButton icon="camera-outline" color="white" onPress={takePhoto} size={50} style={styles.button} />
                            <IconButton icon="camera-reverse-outline" color="white" onPress={toggleCameraType} size={32} style={styles.button} />
                        </View>
                    </View>
                </Camera>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    camera: {
        flex: 1,
    },
    upwardsContainer: {
        flex: 1,
        flexDirection: "column-reverse",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginBottom: 60,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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