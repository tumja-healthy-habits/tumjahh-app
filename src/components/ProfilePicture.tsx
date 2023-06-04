import { imageStyles } from "../styles";
import { Image, ImageSourcePropType, StyleProp, ImageStyle } from "react-native";
import { pb } from "src/pocketbaseService";
import { UserRecord } from "types";

type ProfilePictureProps = {
    user: UserRecord,
    // optional: provide style props for the image which are just passed on to the Image component
    style?: StyleProp<ImageStyle>,
}

export default function ProfilePicture({ user, style }: ProfilePictureProps) {
    const imageSource: ImageSourcePropType = user.avatar ? { uri: pb.getFileUrl(user, user.avatar) } : require("assets/images/default-avatar.jpeg")
    return <Image source={imageSource} style={[imageStyles.image, style]} />
}