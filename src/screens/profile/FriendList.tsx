import { Ionicons } from '@expo/vector-icons';
import ProfilePicture from "components/profile/ProfilePicture";
import Colors from "constants/colors";
import { Alert, FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import { pb } from 'src/pocketbaseService';
import { useFriends } from "src/store/FriendsProvider";
import { FriendsWithRecord, UserRecord } from "types";


export default function FriendList() {
    const friends: UserRecord[] = useFriends()

    function handleTapRemoveFriend(friend: UserRecord) {
        Alert.alert('Remove friend', 'Are you sure you want to remove ' + friend.name + " from your friends?", [
            { text: 'Cancel', onPress: () => { }, style: 'cancel', },
            { text: 'Remove friend', style: "destructive", onPress: () => removeFriend(friend) },
        ]);
    }

    function removeFriend(friend: UserRecord): void {
        if (friend.expand["friends_with(user1)"] !== undefined) {
            friend.expand["friends_with(user1)"].forEach((record: FriendsWithRecord) => {
                pb.collection("friends_with").delete(record.id)
            })
        } else {
            friend.expand["friends_with(user2)"].forEach((record: FriendsWithRecord) => {
                pb.collection("friends_with").delete(record.id)
            })
        }
        console.log("friend removed")
    }

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <View style={styles.container}>
            <ProfilePicture userRecord={item} style={styles.image} />
            <View style={styles.innerContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>{item.username}</Text>
            </View>
            <Button
                mode="outlined"
                buttonColor={Colors.pastelGreen}
                labelStyle={{ fontSize: 16 }}
                style={{ marginRight: 10 }}
                icon={() => <Ionicons name="people-outline" size={20} />}
                onPress={() => handleTapRemoveFriend(item)}
            >
                Remove
            </Button>
        </View>
    }

    return friends.length > 0 ? <View>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", margin: 20 }}>Friends</Text>
        <Divider />
        <FlatList
            data={friends}
            keyExtractor={(friend: UserRecord) => friend.id}
            renderItem={renderFriend}
        />
    </View> : null
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        padding: 2,
        margin: 2,
    },
    innerContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        marginLeft: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    username: {
        fontSize: 14,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
    }
})