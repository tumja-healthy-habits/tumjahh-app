import FriendCard from 'components/feed/FriendCard'
import { FlatList, ListRenderItemInfo, SafeAreaView, Text } from 'react-native'
import { useRealTimeCollection } from 'src/pocketbaseService'
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserProvider'
import { globalStyles } from "src/styles"
import { FriendsWithRecord, PhotosRecord, UserRecord } from 'types'
import { pb } from 'src/pocketbaseService'
import { useState, useEffect } from 'react'
import { getOneDayAgo } from 'components/feed/FriendCard'

export default function FriendsScreen() {
    const { currentUser } = useAuthenticatedUser()
    const [photoExists, setPhotoExists] = useState<boolean>(false)

    const friends: UserRecord[] = useRealTimeCollection<FriendsWithRecord>("friends_with", [], { expand: "user1, user2" })
        .map(getFriend)

    function getFriend(record: FriendsWithRecord): UserRecord {
        if (currentUser === null) throw new Error("Current user is null")
        return record.user1 === currentUser.id ? record.expand.user2 : record.expand.user1
    }

    friends.map(checkPhotoExists)

    useEffect(() =>
    {
        //setPhotoExists(false)
        friends.map(checkPhotoExists);

    }, [photoExists])

    async function checkPhotoExists(user:UserRecord) {
        //console.log("inside checkExists")
        let oneDayAgo = getOneDayAgo()
        let photos = await pb.collection("photos").getFullList({filter: `user_id="${user.id}" && created >= "${oneDayAgo}"`})
        //console.log("Photos length: " + photos.length)
        if (photos.length > 0) {
            setPhotoExists(true)
            //console.log("Photo exists for " + user.username)
        }
    }


    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendCard user={item} />
    }
    console.log(photoExists)
    
    return (
        <SafeAreaView style={[globalStyles.container, { alignItems: 'stretch' }]}>
            {friends.length === 0 && <Text style={[globalStyles.textfieldText, {marginTop:20}]}>You haven't added any friends yet</Text>}
            
            {(!photoExists && friends.length > 0) && <Text style={[globalStyles.textfieldText, {marginTop:20}]}>Your friends haven't posted {"\n"} anything in the last 24 hours</Text>}
            <FlatList
                data={friends}
                keyExtractor={(user: UserRecord) => user.id}
                renderItem={renderFriend}
            />
        </SafeAreaView>
    )
}