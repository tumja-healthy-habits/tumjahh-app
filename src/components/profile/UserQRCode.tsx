import Colors, { opacity } from "constants/colors"
import { createURL } from "expo-linking"
import { useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
//import QRCode from "react-native-qrcode-svg"
import { pb } from "src/pocketbaseService"
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider"

const PROFILE_IMAGE_WIDTH_AND_HEIGHT: number = 120

export default function UserQRCode() {
    const { currentUser } = useAuthenticatedUser()
    const [loaded, setLoaded] = useState<boolean>(false)

    if (currentUser === null) return <View />

    const friendUrl: string = createURL(`addfriend/${currentUser.id}`)
    const profilePicUri: string = pb.getFileUrl(currentUser, currentUser.avatar)

    return (
        // alternatively put the BeHealthy logo in the center of the QR code
        <View style={styles.container}>
            <View style={styles.profilePictureContainer}>
                <Image source={{ uri: profilePicUri, cache: "force-cache" }}
                    style={[styles.profilePicture, loaded && { borderWidth: 2 }]}
                    onLoad={() => setLoaded(true)} />
            </View>
            {/* <QRCode
                value={friendUrl}
                size={220}
                logo={require("assets/images/behealthy-icon.png")}
                logoSize={70}
                backgroundColor="transparent"
                color={Colors.white}
                logoBorderRadius={200}
            /> */}
            <Text style={styles.nameText}>{currentUser.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: PROFILE_IMAGE_WIDTH_AND_HEIGHT / 2 + 20,
        paddingBottom: 30,
        marginHorizontal: 50,
        borderRadius: 40,
        backgroundColor: opacity(Colors.black, 0.7),
    },
    nameText: {
        color: Colors.white,
        fontSize: 35,
        marginTop: 20,
        fontWeight: "bold",
    },
    profilePictureContainer: {
        position: 'absolute',
        top: -(PROFILE_IMAGE_WIDTH_AND_HEIGHT / 2),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: PROFILE_IMAGE_WIDTH_AND_HEIGHT / 2,
    },
    profilePicture: {
        width: PROFILE_IMAGE_WIDTH_AND_HEIGHT,
        height: PROFILE_IMAGE_WIDTH_AND_HEIGHT,
        borderRadius: PROFILE_IMAGE_WIDTH_AND_HEIGHT / 2,
        borderColor: Colors.white,
    }
})