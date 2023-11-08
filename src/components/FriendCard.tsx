import { styles, imageStyles } from "../styles";
import { Pressable, View, Text } from "react-native";
import { UserRecord } from "types";
import ProfilePicture from "./ProfilePicture";
import { pb } from "src/pocketbaseService";

type FriendCardProps = {
    userIdFrom: string | undefined,
    userTo: UserRecord,
}

export default function FriendCard({ userIdFrom, userTo }: FriendCardProps) {
    function handleTapFriend(): void {
        console.log("TODO Add friend")
        // TODO: In the future we can perform some action when the user taps on a friend card
    }
    return (
        <View style={[imageStyles.outerContainer, { flex: 1 }]}>
            <Pressable onPress={handleTapFriend}>
                <View style={imageStyles.innerContainer}>
                    <ProfilePicture user={userTo} style={imageStyles.image} />
                    <Text style={styles.textfieldText}>{userTo.name}</Text>
                </View>
            </Pressable>
        </View>
    )
}