import { useEffect, useMemo, useState } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { FriendRequestsRecord, UserRecord } from "types";
import ActionButton from "../misc/ActionButton";

type ProfilePreviewProps = {
    userId: string
}

export default function ProfilePreview({ userId }: ProfilePreviewProps) {
    const { currentUser } = useAuthenticatedUser()
    const [friendRecord, setFriendRecord] = useState<UserRecord>()

    useEffect(() => {
        pb.collection("users").getOne<UserRecord>(userId)
            .then(setFriendRecord)
            .catch(() => setFriendRecord(currentUser!))
    }, [userId])

    const profilePicSource = useMemo<ImageSourcePropType>(() => {
        if (!friendRecord || !friendRecord.avatar) return require("assets/images/default-avatar.jpeg")
        return { uri: pb.getFileUrl(friendRecord, friendRecord.avatar) }
    }, [friendRecord])

    if (currentUser === null) return <View />

    if (friendRecord === undefined) return <View>
        <Text>Sorry. This user was not found :(</Text>
    </View>

    async function handleAddFriend(): Promise<void> {
        if (currentUser === null || friendRecord === undefined) return
        pb.collection("friend_requests").create<FriendRequestsRecord>({
            from: currentUser.id,
            to: friendRecord.id,
        }).catch(console.error)
    }


    return (
        <View style={styles.container}>
            {/* <ProfilePicture user={friendRecord} style={styles.profilePicture} /> */}
            <Image source={profilePicSource} style={styles.profilePicture} />
            <Text style={styles.name}>{friendRecord.name}</Text>
            <Text style={styles.username}>{friendRecord.username}</Text>
            <ActionButton title="Add as a friend" onPress={handleAddFriend} />
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