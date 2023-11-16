import FriendCard from 'components/feed/FriendCard'
import { FlatList, ListRenderItemInfo, SafeAreaView, Text } from 'react-native'
import { useRealTimeCollection } from 'src/pocketbaseService'
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserProvider'
import { globalStyles } from "src/styles"
import { FriendsWithRecord, UserRecord } from 'types'

export default function FriendsScreen() {
    const { currentUser } = useAuthenticatedUser()

    const friends: UserRecord[] = useRealTimeCollection<FriendsWithRecord>("friends_with", [], { expand: "user1, user2" })
        .map(getFriend)

    function getFriend(record: FriendsWithRecord): UserRecord {
        if (currentUser === null) throw new Error("Current user is null")
        return record.user1 === currentUser.id ? record.expand.user2 : record.expand.user1
    }

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendCard user={item} />
    }

    return (
        <SafeAreaView style={[globalStyles.container, { alignItems: 'stretch' }]}>
            {friends.length === 0 && <Text style={globalStyles.textfieldText}>You haven't added any friends yet</Text>}
            <FlatList
                data={friends}
                keyExtractor={(user: UserRecord) => user.id}
                renderItem={renderFriend}
            />
        </SafeAreaView>
    )
}