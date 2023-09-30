import { useState, useEffect, useMemo } from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { UserRecord } from "types";
import ActionButton from "./ActionButton";

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
        console.log("adding friend", friendRecord)
        //TODO: create friends_with entry in pocketbase, maybe refresh / add the new friend to the Feed directly
    }


    return (
        <View style={styles.container}>
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