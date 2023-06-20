import { RouteProp, useRoute } from "@react-navigation/native";
import { ProfileParamList } from "./ProfileNavigator";
import { View, Text, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { UserRecord } from "types";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import ActionButton from "components/ActionButton";
import Colors from "constants/colors";

export default function AddFriendScreen() {
    const { params } = useRoute<RouteProp<ProfileParamList, 'AddFriend'>>()
    const { currentUser } = useAuthenticatedUser()
    const [friendRecord, setFriendRecord] = useState<UserRecord>()

    if (currentUser === null) return <View />

    useEffect(() => {
        pb.collection("users").getOne<UserRecord>(params.userId)
            .then(setFriendRecord)
            .catch(() => setFriendRecord(currentUser))
    }, [params])

    if (friendRecord === undefined) return <View>
        <Text>Sorry. This user was not found :(</Text>
    </View>

    async function handleAddFriend(): Promise<void> {
        console.log("adding friend", friendRecord)
        //TODO: create friends_with entry in pocketbase, maybe refresh / add the new friend to the Feed directly
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: pb.getFileUrl(friendRecord, friendRecord.avatar) }} style={styles.profilePicture} />
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