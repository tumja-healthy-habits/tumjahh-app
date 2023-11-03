import { NavigationProp, RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppParamList } from "components/LoggedInApp"
import ZoomableCamera from "components/ZoomableCamera"
import { CameraCapturedPicture } from "expo-camera"
import { BaseModel } from "pocketbase"
import { useEffect, useState } from "react"
import { Button, Image, View } from "react-native"
import Animated from "react-native-reanimated"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { pb } from "src/pocketbaseService"
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider"
import { useDailyChallenges } from "src/store/DailyChallengesProvider"
import { PhotosRecord } from "types"
import { HomeStackNavigatorParamList } from "./HomeScreen"

export default function TakePhotoScreen() {
    const [photo, setPhoto] = useState<CameraCapturedPicture>()
    const { currentUser } = useAuthenticatedUser()
    const { params } = useRoute<RouteProp<HomeStackNavigatorParamList, "Take Photo">>()
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackNavigatorParamList, "Challenges">>()
    const appNavigation = useNavigation<NavigationProp<AppParamList>>()
    const isFocused: boolean = useIsFocused()
    const { completeChallenge } = useDailyChallenges()

    useEffect(() => {
        navigation.setOptions({
            title: params.challengeName,
        })
    }, [])

    if (params === undefined || !isFocused) return <View />

    async function sendPhoto(): Promise<PhotosRecord> {
        // We're assuming that currentUser and photo are both not undefined (that's what the exclamation marks do)
        const formData: FormData = new FormData()
        formData.append('photo', {
            uri: photo!.uri,
            name: photo!.uri,
            type: "image/jpg"
        } as any)
        formData.append("user_id", currentUser!.id)
        formData.append("width", photo!.width.toString())
        formData.append("height", photo!.height.toString())
        formData.append("challenge_name", params.challengeName)
        return pb.collection("photos").create<PhotosRecord>(formData)
    }

    function handleUsePhoto(): void {
        // This is for when pocketbase is running again:
        // sendPhoto().then((photoRecord: PhotosRecord) => {
        //     completeChallenge(params.challengeName, photoRecord)
        //     if (navigation.canGoBack()) {
        //         navigation.goBack()
        //     }
        // })
        //     .catch((e: any) => console.log(JSON.stringify(e)))
        //     .finally(() => setPhoto(undefined))

        // This is for when pocketbase is down:
        completeChallenge(params.challengeName, {
            id: "fake-id",
            photo: "https://picsum.photos/200",
            user_id: "fake-user-id",
            width: 0,
            height: 0,
            challenge_name: params.challengeName,
            collectionId: "fake-collection-id",
            created: "fake-created-date",
            updated: "fake-updated-date",
            collectionName: "fake-collection-name",
            expand: {},
            load: () => { },
            loadExpand: () => { },
            isNew: true,
            clone: () => { return {} as BaseModel },
            export: () => ({}),
        } as unknown as PhotosRecord)
        if (photo !== undefined) {
            appNavigation.navigate("Mosaic", {
                imageUri: photo?.uri,
            })
        }
    }

    function handleSkipPhoto(): void {
        if (navigation.canGoBack()) {
            navigation.goBack()
        }
    }

    return photo ? (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: Colors.pastelViolet,
        }}>
            <Animated.View style={{ flex: 1, }}>
                <Image source={{ uri: photo.uri }} style={{ flex: 1, resizeMode: "contain" }} />
            </Animated.View>
            <Button disabled color={Colors.accent} title="Send photo" onPress={sendPhoto} />
            <Button color={Colors.accent} title="Maybe later" onPress={handleSkipPhoto} />
            <Button color={Colors.accent} title="Take another photo" onPress={() => setPhoto(undefined)} />
            <Button color={Colors.accent} title="Use photo" onPress={handleUsePhoto} />
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