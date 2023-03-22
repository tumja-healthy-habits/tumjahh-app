import FriendCard from 'components/FriendCard'
import { useEffect, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native'
import { pb } from 'src/pocketbaseService'
import { UserRecord } from 'types'

const dummyFriends: UserRecord[] = [
    { "avatar": "img_d9076_b7_c9002_1_MQckAI28Mz.jpeg", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 16:12:56.015Z", "emailVisibility": false, "expand": {}, "id": "i3w0162pbgzwc6u", "name": "", "updated": "2023-03-21 16:05:49.687Z", "username": "users16721", "verified": false },
    { "avatar": "", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 16:13:25.257Z", "emailVisibility": false, "expand": {}, "id": "hmxsw8qe7kq9ugi", "name": "", "updated": "2023-03-20 16:13:25.257Z", "username": "users27131", "verified": false },
    { "avatar": "img_d9076_b7_c9002_1_EUNMAnOMHE.jpeg", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 18:23:54.984Z", "email": "", "emailVisibility": false, "expand": {}, "id": "cbnigaawx6u89jw", "name": "", "updated": "2023-03-21 16:06:59.564Z", "username": "Alex", "verified": false },
]

export default function FriendsScreen() {
    const [friends, setFriends] = useState<UserRecord[]>([])

    useEffect(() => {
        pb.collection("users").getFullList<UserRecord>()
            .then(setFriends) // The promise returns the list of users and applies setFriends to the list
            .catch(() => console.error("An error occured while fetching the friends data!"))
        //setFriends(dummyFriends)
    }, [])

    function renderFriendCard({ item }: ListRenderItemInfo<UserRecord>) {
        const avatarUrl: string = item.avatar ? pb.getFileUrl(item, item.avatar) : ""
        return <FriendCard name={item.username} avatarUrl={avatarUrl} />
    }

    return (
        <View style={styles.friendsContainer}>
            <FlatList
                numColumns={2}
                data={friends}
                keyExtractor={(item: UserRecord) => item.id}
                renderItem={renderFriendCard}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    alignItems: "center"
                }} />
        </View>
    )
}

const styles = StyleSheet.create({
    friendsContainer: {
        backgroundColor: "white",
    }
})