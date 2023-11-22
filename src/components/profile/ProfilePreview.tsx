import { useEffect, useMemo, useState } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { UserRecord } from "types";
import ActionButton from "../misc/ActionButton";

type ProfilePreviewProps = {
    userId: string
    onClose: () => void
}

export default function ProfilePreview({ userId, onClose }: ProfilePreviewProps) {
    const { currentUser } = useAuthenticatedUser()
    const [friendRecord, setFriendRecord] = useState<UserRecord>()

    useEffect(() => {
        pb.collection("users").getOne<UserRecord>(userId, {
            expand: "friend_requests(from).to, friend_requests(to).from, friends_with(user2).user1, friends_with(user1)"
        }).then(setFriendRecord)
    }, [userId])

    const profilePicSource = useMemo<ImageSourcePropType>(() => {
        if (!friendRecord || !friendRecord.avatar) return require("assets/images/default-avatar.jpeg")
        return { uri: pb.getFileUrl(friendRecord, friendRecord.avatar) }
    }, [friendRecord])

    if (currentUser === null) return <View />

    if (friendRecord === undefined) return <ActivityIndicator />

    function handleAddFriend(): void {
        if (currentUser === null || friendRecord === undefined || currentUser.id === friendRecord.id) {
            return onClose()
        }
        pb.collection("friend_requests").create<UserRecord>({
            from: currentUser.id,
            to: friendRecord.id,
        })
        onClose()
    }

    const alreadyFriends: boolean = friendRecord.expand["friends_with(user1)"] !== undefined || friendRecord.expand["friends_with(user2)"] !== undefined
    const friendRequestSent: boolean = friendRecord.expand["friend_requests(from)"] !== undefined
    const friendRequestReceived: boolean = friendRecord.expand["friend_requests(to)"] !== undefined

    return (
        <View style={styles.container}>
            <Image source={profilePicSource} style={styles.profilePicture} />
            <Text style={styles.name}>{friendRecord.name}</Text>
            <Text style={styles.username}>{friendRecord.username}</Text>
            {alreadyFriends ? (
                <Text>Already friends</Text>
            ) : friendRequestSent ? (
                <Text>Friend request sent</Text>
            ) : friendRequestReceived ? (
                <Text>Friend request received</Text>
            ) : (<ActionButton title="Add as a friend" onPress={handleAddFriend} />)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: Colors.pastelGreen,
    },
    profilePicture: {
        width: 200,
        height: 200,
        borderRadius: 25,
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    username: {
        fontSize: 14,
        marginBottom: 10,
    },
})