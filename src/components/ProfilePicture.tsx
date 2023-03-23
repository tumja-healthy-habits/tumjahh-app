import Colors from "constants/colors";
import { StyleSheet, Image, ImageSourcePropType, StyleProp, ImageStyle } from "react-native";
import { pb } from "src/pocketbaseService";
import { UserRecord } from "types";

type ProfilePictureProps = {
    user: UserRecord,
    // optional: provide style props for the image which are just passed on to the Image component
    style?: StyleProp<ImageStyle>,
}

export default function ProfilePicture({ user, style }: ProfilePictureProps) {
    const imageSource: ImageSourcePropType = user.avatar ? { uri: pb.getFileUrl(user, user.avatar) } : require("assets/images/default-avatar.jpeg")
    return <Image source={imageSource} style={[styles.image, style]} />
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 8,
        borderWidth: 3,
        borderColor: Colors.primary,
        width: "100%",
        height: "100%",
        margin: 10,
    },
})