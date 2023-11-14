import FriendCard from 'components/FriendCard'
import { useEffect, useState } from 'react'
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native'
import { pb } from 'src/pocketbaseService'
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserProvider'
import { styles } from "src/styles"
import { FriendsWithRecord, UserRecord } from 'types'

export default function FriendsScreen() {
    const [friends, setFriends] = useState<UserRecord[]>([])
    // const [photos, setPhotos]= useState<PhotosRecord[]>([])
    const { currentUser } = useAuthenticatedUser()

    useEffect(() => {
        if (currentUser === null) {
            setFriends([])
            return
        }
        pb.collection("friends_with").getFullList<FriendsWithRecord>({
            filter: `user1.id= "${currentUser.id}" || user2.id = "${currentUser.id}"`,
        }).then((records: FriendsWithRecord[]) => {
            //extract the id which is not the current user's id
            const friendIds: string[] = records.map(({ user1, user2 }: FriendsWithRecord) => user1 === currentUser.id ? user2 : user1)
            if (friendIds.length === 0) {
                setFriends([])
                return
            }
            const query: string = friendIds.map((id: string) => `id="${id}"`).join("||") // id="..."||id="..."
            pb.collection("users").getFullList<UserRecord>({
                filter: query,
            }).then(setFriends)
        }).catch((error) => console.error("An error occured while fetching the friends data", error))
    }, [currentUser])

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendCard user={item} />
    }

    return (
        <View style={[styles.container, { alignItems: 'stretch' }]}>
            {friends.length === 0 && <Text style={styles.textfieldText}>You haven't added any friends yet</Text>}
            <FlatList
                data={friends}
                keyExtractor={(user: UserRecord) => user.id}
                renderItem={renderFriend}
            />
        </View>
    )
}