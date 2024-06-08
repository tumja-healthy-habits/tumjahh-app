import FriendCard, { getOneDayAgo } from 'components/feed/FriendCard'
import { useEffect, useState } from 'react'
import { FlatList, ListRenderItemInfo, SafeAreaView, Text } from 'react-native'
import { pb } from 'src/pocketbaseService'
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserProvider'
import { useFriends } from 'src/store/FriendsProvider'
import { globalStyles } from "src/styles"
import { PhotosRecord, UserRecord } from 'types'

export default function FeedScreen() {
    const { currentUser } = useAuthenticatedUser()
    const [photoExists, setPhotoExists] = useState<boolean>(false)

    const friends: UserRecord[] = useFriends()

    useEffect(() => {

        pb.collection("photos").getFullList<PhotosRecord>({
            filter: `created >= "${getOneDayAgo()}"`,
        }).then((photos: PhotosRecord[]) => setPhotoExists(photos.length > 0))
    }, [photoExists])

    if (currentUser === null) {
        return (
            <SafeAreaView style={[globalStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={[globalStyles.textfieldText, { marginTop: 20 }]}>You must be logged in to view your feed</Text>
            </SafeAreaView>
        )
    }

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendCard user={item} />
    }

    
    return (
        <SafeAreaView style={[globalStyles.container, { alignItems: 'stretch' }]}>
            {friends.length === 0 && <Text style={[globalStyles.textfieldText, { marginTop: 20 }]}>You haven't added any friends yet</Text>}
            {(!photoExists && friends.length > 0) && <Text style={[globalStyles.textfieldText, { marginTop: 20 }]}>Your friends haven't posted {"\n"} anything in the last 24 hours</Text>}
            <FlatList
                data={[...friends, currentUser]}
                keyExtractor={(user: UserRecord) => user.id}
                renderItem={renderFriend}
            />
        </SafeAreaView>
    )
}