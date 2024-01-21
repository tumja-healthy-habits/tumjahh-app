import { Ionicons } from '@expo/vector-icons';
import Colors from "constants/colors";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { pb } from 'src/pocketbaseService';
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserProvider';
import { FriendRequestsRecord, FriendsWithRecord, UserRecord } from "types";
import ProfilePicture from "./ProfilePicture";

type FriendSearchResultProps = {
    user: UserRecord,
    updateSearchResult: (user: UserRecord) => void,
}

export default function FriendSearchResult({ user, updateSearchResult }: FriendSearchResultProps) {

    const { currentUser } = useAuthenticatedUser()

    function sendRequest(): void {
        if (currentUser === null) return
        pb.collection("friend_requests").create<FriendRequestsRecord>({
            from: currentUser.id,
            to: user.id,
        })
        console.log("friend added")
        updateSearchResult(user)
    }

    function cancelFriendRequest(): void {
        user.expand["friend_requests(to)"].forEach((request: FriendRequestsRecord) => {
            pb.collection("friend_requests").delete(request.id)
        })
        console.log("friend reqeuest cancelled")
        updateSearchResult(user)
    }

    function acceptFriendRequest(): void {
        if (currentUser === null) return
        pb.collection("friends_with").create<UserRecord>({
            user1: user.id,
            user2: currentUser.id
        })
        user.expand["friend_requests(from)"].forEach((request: FriendRequestsRecord) => {
            pb.collection("friend_requests").delete(request.id)
        })
        console.log("friend request accepter")
        updateSearchResult(user)
    }

    function handleTapFriend() {
        Alert.alert('Remove friend', 'Are you sure you want to remove ' + user.name + " from your friends?", [
            { text: 'Cancel', onPress: () => { }, style: 'cancel', },
            { text: 'Remove friend', style: "destructive", onPress: removeFriend },
        ]);
    }

    function removeFriend(): void {
        if (user.expand["friends_with(user1)"] !== undefined) {
            user.expand["friends_with(user1)"].forEach((record: FriendsWithRecord) => {
                pb.collection("friends_with").delete(record.id)
            })
        } else {
            user.expand["friends_with(user2)"].forEach((record: FriendsWithRecord) => {
                pb.collection("friends_with").delete(record.id)
            })
        }
        console.log("friend removed")
        updateSearchResult(user)
    }

    const alreadyFriends: boolean = user.expand["friends_with(user1)"] !== undefined || user.expand["friends_with(user2)"] !== undefined
    const friendRequestSent: boolean = user.expand["friend_requests(to)"] !== undefined
    const friendRequestReceived: boolean = user.expand["friend_requests(from)"] !== undefined

    return <View style={styles.container}>
        <ProfilePicture userRecord={user} style={styles.image} />
        <View style={styles.innerContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
        </View>
        <Button
            mode="outlined"
            onPress={alreadyFriends ? handleTapFriend : friendRequestSent ? cancelFriendRequest : friendRequestReceived ? acceptFriendRequest : sendRequest}
            buttonColor={Colors.pastelGreen}
            labelStyle={{ fontSize: 16 }}
            style={{ marginRight: 10 }}
            icon={() => <Ionicons name={alreadyFriends ? "people-outline" :
                "person-add-outline"} size={20} />}
        >{alreadyFriends ? "Friends" : friendRequestSent ? "Request sent" : friendRequestReceived ? "Accept" : "Add"}
        </Button>
    </View>
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