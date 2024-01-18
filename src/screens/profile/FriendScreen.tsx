import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import BlurModal from "components/misc/BlurModal";
import FriendRequestList from "components/profile/FriendRequestList";
import FriendSearch from "components/profile/FriendSearch";
import ProfilePreview from "components/profile/ProfilePreview";
import UserQRCode from "components/profile/UserQRCode";
import Colors from "constants/colors";
import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, ListRenderItemInfo, Text, Alert} from "react-native";
import { TextInput, Divider, Button } from "react-native-paper";
import { ProfileParamList } from "./ProfileNavigator";
import { UserRecord, FriendsWithRecord } from "types";
import { useRealTimeCollection, pb } from 'src/pocketbaseService'
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserProvider'
import { Ionicons } from "@expo/vector-icons";
import ProfilePicture from "components/profile/ProfilePicture";



export default function FriendScreen() {
    const { currentUser } = useAuthenticatedUser()
    const { navigate, goBack } = useNavigation<NavigationProp<ProfileParamList, "ProfilePage">>()
    
    const friends: UserRecord[] = useRealTimeCollection<FriendsWithRecord>("friends_with", [], { expand: "user1, user2" })
        .map(getFriend)

    function getFriend(record: FriendsWithRecord): UserRecord {
        if (currentUser === null) throw new Error("Current user is null")
        return record.user1 === currentUser.id ? record.expand.user2 : record.expand.user1
    }

    const [searchText, setSearchText] = useState<string>("")
    const [searchResults, setSearchResults] = useState<UserRecord[]>([]);
    const [updateSearch, setUpdateSearch] = useState<boolean>(false)

    useEffect(() => {
        submitSearch()
    }, [searchText])

    async function submitSearch() {
        if (currentUser === null) {
            return
        }
        setSearchResults(friends.filter((friend:UserRecord) => {return (friend.username.toLowerCase().startsWith(searchText.toLowerCase()) || friend.name.toLowerCase().startsWith(searchText.toLowerCase()))}))
    }

    async function removeFriend(friend: UserRecord) {
        const record = await pb.collection('friends_with')  
            .getFirstListItem('someField="test"',);
    }

    function handlePressFriend(friend: UserRecord) {
        Alert.alert('Remove friend', 'Are you sure you want to remove ' + friend.name + " from your friends?", [
            {text: 'Cancel', onPress: () => {}, style: 'cancel',},
            {text: 'Remove friend', style:"destructive", onPress: () => removeFriend(friend)},
          ]);
    }

    function renderFriendSearch({ item }: ListRenderItemInfo<UserRecord>) {
        return (
        <View style={styles.container}>
            <ProfilePicture userRecord={item} style={styles.image} />
            <View style={styles.innerContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>{item.username}</Text>
            </View>
            <Button
                mode="outlined"
                onPress={() => handlePressFriend(item)}
                buttonColor={Colors.pastelGreen}
                labelStyle={{ fontSize: 16 }}
                icon={() => <Ionicons name="people-outline" size={20} />}
            >Friends
            </Button>
        </View>
        )
    }

    return <View style={{ backgroundColor: Colors.pastelGreen }}>
        <View>
            <TextInput value={searchText}
                placeholder="Search friends"
                onChangeText={setSearchText}
                autoCapitalize="none"
                autoCorrect={false}
                left={<TextInput.Icon icon={() => <Ionicons name="search-outline" size={24} color="black" />} />}
                style={{ backgroundColor: "transparent", marginBottom:5,}}
                dense={true}
            />
            
            <FlatList
                data={searchResults}
                keyExtractor={(user: UserRecord) => user.id}
                renderItem={renderFriendSearch}
                ItemSeparatorComponent={() => <Divider bold horizontalInset />}
                style={{marginBottom:20, flexGrow:0}}
                extraData={updateSearch}
            />
        </View>    

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