import { Ionicons } from "@expo/vector-icons"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { pb } from "src/pocketbaseService"
import { FriendRequestsRecord, UserRecord } from "types"
import ProfilePicture from "./ProfilePicture"

type FriendRequestProps = {
    friendRequest: FriendRequestsRecord,
    incoming: boolean,
}

export default function FriendRequest({ friendRequest, incoming }: FriendRequestProps) {
    const [friend, setFriend] = useState<UserRecord>()

    useEffect(() => {
        pb.collection("users").getOne<UserRecord>(incoming ? friendRequest.from : friendRequest.to)
            .then(setFriend)
            .catch((error: any) => console.error(error, friendRequest))
    }, [])

    if (friend === undefined) return <ActivityIndicator />

    function rejectRequest(): void {
        pb.collection("friend_requests").delete(friendRequest.id)
        console.log("request rejected")
    }

    function acceptRequest(): void {
        pb.collection("friend_requests").delete(friendRequest.id)
        pb.collection("friends_with").create({
            user1: friendRequest.from,
            user2: friendRequest.to,
        })
        console.log("request accepted")
    }

    function deleteRequest(): void {
        pb.collection("friend_requests").delete(friendRequest.id)
        console.log("request deleted")
    }

    return <View style={styles.container}>
        <ProfilePicture userRecord={friend} style={styles.image} />
        <View style={styles.innerContainer}>
            <Text style={styles.name}>{friend.name}</Text>
            <Text style={styles.username}>{friend.username}</Text>
        </View>
        <View>
            {incoming ? (<><RequestActionButton
                onPress={acceptRequest}
                iconName="person-add-outline"
                label="Accept" />
                <RequestActionButton
                    onPress={rejectRequest}
                    iconName="close-outline"
                    label="Decline" /></>)
                : (<RequestActionButton
                    onPress={deleteRequest}
                    iconName="close-outline"
                    label="Revoke" />)}
        </View>
    </View>
}

type RequestActionButtonProps = {
    onPress: () => void,
    label: string,
    iconName: any,
}

function RequestActionButton({ onPress, label, iconName }: RequestActionButtonProps) {
    return <Button
        mode="outlined"
        onPress={onPress}
        buttonColor={Colors.pastelGreen}
        labelStyle={{ fontSize: 16 }}
        icon={() => <Ionicons name={iconName} size={20} />}>{label}</Button>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        padding: 10,
        margin: 10,
    },
    innerContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        marginLeft: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    username: {
        fontSize: 16,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 25,
        borderWidth: 2,
    }
})