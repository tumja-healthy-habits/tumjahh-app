import { NavigationProp, RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppParamList } from "components/LoggedInApp"
import ZoomableCamera from "components/camera/ZoomableCamera"
import Colors from "constants/colors"
import { saveToLibraryAsync } from "expo-media-library"
import { useEffect, useState } from "react"
import { Button, Image, StyleSheet, View } from "react-native"
import { pb } from "src/pocketbaseService"
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider"
import { useDailyChallenges } from "src/store/DailyChallengesProvider"
import { FixedDimensionImage, PhotosRecord } from "types"
import { HomeStackNavigatorParamList } from "./HomeScreen"

export default function TakePhotoScreen() {
    const [photo, setPhoto] = useState<FixedDimensionImage>()
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
        console.log("In take photo screen")
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
        // This is for when pocketbase is running
        sendPhoto().then((photoRecord: PhotosRecord) => {
            completeChallenge(params.challengeName, photoRecord)
            if (navigation.canGoBack()) {
                navigation.goBack()
            }
        })
            .catch((e: any) => console.log(JSON.stringify(e)))
            .finally(() => setPhoto(undefined))

        saveToLibraryAsync(photo!.uri)

        if (photo !== undefined) {
            appNavigation.navigate("Mosaic", {
                imageUri: photo.uri,
            })
        }
        // This is for when pocketbase is down:
        // completeChallenge(params.challengeName, {
        //     id: "fake-id",
        //     photo: "https://picsum.photos/200",
        //     user_id: "fake-user-id",
        //     width: 0,
        //     height: 0,
        //     challenge_name: params.challengeName,
        //     collectionId: "fake-collection-id",
        //     created: "fake-created-date",
        //     updated: "fake-updated-date",
        //     collectionName: "fake-collection-name",
        //     expand: {},
        //     load: () => { },
        //     loadExpand: () => { },
        //     isNew: true,
        //     clone: () => { return {} as BaseModel },
        //     export: () => ({}),
        // } as unknown as PhotosRecord)
    }

    function handleSkipPhoto(): void {
        if (navigation.canGoBack()) {
            navigation.goBack()
        }
    }

    return photo ? (
        <View style={styles.container}>
            <View style={styles.imageContainer} >
                <Image source={{ uri: photo.uri }} style={[styles.image, { aspectRatio: photo.width / photo.height }]} />
            </View>
            <View style={styles.buttonContainer} >
                <Button color={Colors.accent} title={"Maybe \n later"} onPress={handleSkipPhoto} />
                <Button color={Colors.accent} title={"Take\n another\n photo"} onPress={() => setPhoto(undefined)} />
                <Button color={Colors.accent} title={"Use \nphoto"} onPress={handleUsePhoto} />
            </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.pastelViolet,
        justifyContent: "space-between",
    },
    image: {
        resizeMode: "contain",
        width: "100%",
    },
    imageContainer: {
        //show a red border
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 10,
        overflow: "hidden",
    },
    button: {
        backgroundColor: Colors.accent,
        borderRadius: 10,
        padding: 20,
        margin: 20,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 20,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.white,
    },
})