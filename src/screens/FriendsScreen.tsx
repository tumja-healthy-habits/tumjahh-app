import { useIsFocused } from '@react-navigation/native'
import Colors from 'constants/colors'
import FriendCard from 'components/FriendCard'
import { useEffect, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, View, Text } from 'react-native'
import { pb } from 'src/pocketbaseService'
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserContext'
import { FriendsWithRecord, UserRecord } from 'types'

const dummyFriends: UserRecord[] = [
    { "avatar": "img_d9076_b7_c9002_1_MQckAI28Mz.jpeg", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 16:12:56.015Z", "emailVisibility": false, "expand": {}, "id": "i3w0162pbgzwc6u", "name": "", "updated": "2023-03-21 16:05:49.687Z", "username": "users16721", "verified": false, "email": "" },
    { "avatar": "", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 16:13:25.257Z", "emailVisibility": false, "expand": {}, "id": "hmxsw8qe7kq9ugi", "name": "", "updated": "2023-03-20 16:13:25.257Z", "username": "users27131", "verified": false, "email": "" },
    { "avatar": "img_d9076_b7_c9002_1_EUNMAnOMHE.jpeg", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 18:23:54.984Z", "email": "", "emailVisibility": false, "expand": {}, "id": "cbnigaawx6u89jw", "name": "", "updated": "2023-03-21 16:06:59.564Z", "username": "Alex", "verified": false },
]

export default function FriendsScreen() {
    const [friends, setFriends] = useState<UserRecord[]>([])
    const { currentUser } = useAuthenticatedUser()

    const isFocused: boolean = useIsFocused()

    useEffect(() => {
        if (!isFocused) return
        if (currentUser === null) {
            setFriends([])
            return
        }
        pb.collection("friends_with").getFullList<FriendsWithRecord>({
            filter: `user1.id= "${currentUser.id}" || user2.id = "${currentUser.id}"`,
        }).then((records: FriendsWithRecord[]) => {
            //extract the id which is not the current user's id
            return records.map(({ user1, user2 }: FriendsWithRecord) => user1 === currentUser.id ? user2 : user1)
        }).then((ids: string[]) => {
            pb.collection("users").getFullList<UserRecord>({
                filter: ids.map((id: string) => `id="${id}"`).join("||")
            }).then(setFriends)
        }).catch((error) => console.error("An error occured while fetching the friends data", error))
    }, [isFocused])

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendCard user={item} />
    }

    return (
        <View style={styles.friendsContainer}>
            {friends.length === 0 && <Text style={styles.noFriendsText}>You haven't added any friends yet</Text>}
            <FlatList
                numColumns={2}
                data={friends}
                keyExtractor={(user: UserRecord) => user.id}
                renderItem={renderFriend}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    alignItems: "center"
                }} />
        </View>
    )
}

const styles = StyleSheet.create({
    friendsContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
    },
    noFriendsText: {
        color: Colors.accent,
        flex: 1,
        textAlign: "center",
    }
})