import { Image, ImageSourcePropType, ImageStyle, StyleProp } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { UserRecord } from "types";
import { imageStyles } from "../../styles";

type ProfilePictureProps = {
    userRecord?: UserRecord,
    // optional: provide style props for the image which are just passed on to the Image component
    style?: StyleProp<ImageStyle>,
    uri?: string,
}

export default function ProfilePicture({ userRecord, style, uri }: ProfilePictureProps) {
    if (uri !== undefined) {
        return <Image source={{ uri: uri, cache: "force-cache" }} style={[imageStyles.image, style]} />
    }
    // if the user has an avatar picture, compute its pocketbase uri, otherwise use a default avatar picture
    const user: UserRecord = userRecord ?? useAuthenticatedUser().currentUser as UserRecord // can't be null because we're using this component in the ProfileScreen
    const imageSource: ImageSourcePropType = user.avatar ? { uri: pb.getFileUrl(user, user.avatar) } : require("assets/images/default-avatar.png")
    return <Image source={imageSource} style={[imageStyles.image, style]} />
}