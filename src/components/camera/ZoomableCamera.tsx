import Colors from "constants/colors";
import { Camera, CameraType, requestCameraPermissionsAsync } from "expo-camera";
import { ImagePickerResult, MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, GestureStateChangeEvent, GestureUpdateEvent, PinchGesture, PinchGestureHandlerEventPayload } from "react-native-gesture-handler";
import { FixedDimensionImage } from "types";
import IconButton from "../misc/IconButton";

type ZoomableCameraProps = {
    onTakePhoto: (photo: FixedDimensionImage) => void,
}

const IMAGE_QUALITY: number = 0.2 // from 0 lowest to 1 highest quality
const ZOOM_SPEED: number = 0.003 // the smaller the slower
const MAX_ZOOM_CAMERA: number = 0.2

export default function ZoomableCamera({ onTakePhoto }: ZoomableCameraProps) {
    const [type, setType] = useState(CameraType.back);
    const cameraRef = useRef<Camera>(null)
    const [scale, setScale] = useState<number>(1)
    const [savedScale, setSavedScale] = useState<number>(1)
    const [cameraPermission, setCameraPermission] = useState<boolean>(false)

    useEffect(() => {
        setScale(1)
        if (!cameraPermission) {
            getPermission()
        }
    }, [type])

    async function getPermission() {
        const permission = await requestCameraPermissionsAsync()
        setCameraPermission(permission.status === 'granted');
    }

    async function openMediaLibrary(): Promise<void> {
        launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], //for android, on ios the crop rectangle is always a square
            quality: IMAGE_QUALITY,
            allowsMultipleSelection: false,
        }).then((result: ImagePickerResult) => {
            if (result.canceled) return
            onTakePhoto(result.assets[0])
        })
    }


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

    if (cameraPermission) {
        return (
            <View style={styles.outerContainer}>
                <GestureHandlerRootView style={styles.innerContainer}>
                    <GestureDetector gesture={pinchGesture}>
                        <Camera style={styles.camera} type={type} ref={cameraRef} zoom={ZOOM_SPEED * (scale - 1)} />
                    </GestureDetector>
                </GestureHandlerRootView>
                <View style={styles.upwardsContainer}>
                    <View style={styles.buttonContainer}>
                        <IconButton icon="image-outline" color="white" onPress={openMediaLibrary} size={40} style={styles.button} />
                        <IconButton icon="camera-outline" color="white" onPress={takePhoto} size={50} style={styles.button} />
                        <IconButton icon="camera-reverse-outline" color="white" onPress={toggleCameraType} size={32} style={styles.button} />
                    </View>
                </View>
            </View> 
        )
    }
    else {
        return (
            <View style={styles.outerContainer}>
                <Text>Camera not available. Please change camera permission in your settings.</Text>
            </View>
        )
    }

    
    
    
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        backgroundColor: "black",
    },
    innerContainer: {
        height: Dimensions.get("window").width,
        marginVertical: 20 
    },
    camera: {
        flex: 1,
    },
    upwardsContainer: {
        //flex: 1,
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