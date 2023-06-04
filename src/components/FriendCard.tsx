import { styles, imageStyles } from "../styles";
import { Pressable, View, Text } from "react-native";
import { UserRecord } from "types";
import ProfilePicture from "./ProfilePicture";

type FriendCardProps = {
    user: UserRecord,
}

export default function FriendCard({ user }: FriendCardProps) {
    return (
        <View style={[imageStyles.outerContainer, {flex: 1}]}>
            <Pressable>
                <View style={imageStyles.innerContainer}>
                    <ProfilePicture user={user} style={imageStyles.image} />
                    <Text style={styles.textfieldText}>{user.name}</Text>
                </View>
            </Pressable>
        </View>
    )
}