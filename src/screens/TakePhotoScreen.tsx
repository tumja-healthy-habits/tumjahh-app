import { RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import ZoomableCamera from "components/ZoomableCamera"
import { CameraCapturedPicture } from "expo-camera"
import { useEffect, useState } from "react"
import { View, Button, Image, Alert } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { pb } from "src/pocketbaseService"
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext"
import { HomeStackNavigatorParamList } from "./HomeScreen"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export default function TakePhotoScreen() {
    const [photo, setPhoto] = useState<CameraCapturedPicture>()
    const { currentUser } = useAuthenticatedUser()
    const { params } = useRoute<RouteProp<HomeStackNavigatorParamList, "Take Photo">>()
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackNavigatorParamList, "Challenges">>()
    const isFocused: boolean = useIsFocused()

    useEffect(() => {
        navigation.setOptions({
            title: params.challengeName,
        })
    }, [])

    if (params === undefined || !isFocused) return <View />

    async function sendPhoto() {
        if (!photo || !currentUser) return
        const formData: FormData = new FormData()
        formData.append('photo', {
            uri: photo.uri,
            name: photo.uri,
            type: "image/jpg"
        } as any)
        formData.append("user_id", currentUser.id)
        formData.append("width", photo.width.toString())
        formData.append("height", photo.height.toString())
        formData.append("challenge_name", params.challengeName)
        pb.collection("photos").create(formData)
            .then(() => {
                navigation.goBack()
                Alert.alert("Foto wurde hochgeladen!")
            })
            .catch((e: any) => console.log(JSON.stringify(e)))
    }

    return photo ? (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: Colors.pastelViolet,
        }}>
            <Image source={{ uri: photo.uri }} style={{ flex: 1, resizeMode: "contain" }} />
            <Button color={Colors.accent} title="Send photo" onPress={sendPhoto} />
            <Button color={Colors.accent} title="Take another photo" onPress={() => setPhoto(undefined)} />
        </View>
    ) : (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: Colors.pastelViolet,
        }}>
            <ZoomableCamera onTakePhoto={setPhoto} />
        </View>
    )
}