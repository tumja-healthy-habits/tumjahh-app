import { View, Image, Text, TextInput, PermissionsAndroid, FlatList, ListRenderItemInfo, Pressable } from "react-native";
import { useEffect, useState } from "react";
import Colors from "constants/colors";
import { styles } from "src/styles";
import { pb } from "src/pocketbaseService";
import { UserRecord } from "types";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import * as Contacts from "expo-contacts";
import FriendCard from "./FriendCard";

export default function FriendSearch() {
    // const navigation = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()
    const { currentUser, setCurrentUser } = useAuthenticatedUser()
    const [searchInput, setSearchInput] = useState<string>("")
    const [data, setData] = useState<any[]>();

    async function submitSearch() {
        console.log("searching")

        if (searchInput.length > 0) {
            // USERS

            const foundByUsername = (await pb.collection("users").getFullList<UserRecord>({
                filter: `username ~ "${searchInput}"`
            }))
                .map((user) => user.id)

            // CONTACTS

            // contacts permission
            const { status } = await Contacts.getPermissionsAsync()
            if (status === Contacts.PermissionStatus.GRANTED) {
                // getting contacts
                const { data } = await Contacts.getContactsAsync({
                    name: searchInput,
                    fields: [Contacts.Fields.PhoneNumbers]
                })

                // extracting numbers from contacts --> creating filter
                const foundByContactname = data
                    .map(contact =>
                        // extracting phone numbers
                        contact.phoneNumbers?.map(
                            (numberEntry) => {
                                // unpacking and formatting number
                                var number = numberEntry.number?.replaceAll(/[^+0-9]/g, "")
                                // checking for country code (+49 fallback)
                                if (number?.startsWith("00")) {
                                    number = "+" + number.substring(2)
                                } else if (number?.startsWith("0")) {
                                    number = "+49" + number.substring(1)
                                } else if (!number?.startsWith("+")) {
                                    number = "+49" + number
                                }
                                return `phoneNumber = "${number}"`
                            }
                        )
                    ).flat()
                    .filter((number) => number != null)
                    .join(" || ")

                // Matching phone numbers
                const contactMatches = (await pb.collection("users").getFullList<UserRecord>({
                    filter: `username !~ "${searchInput}" && (` + foundByContactname + `)`
                }))
                    .map((user) => user.id)
                setData(foundByUsername.concat(contactMatches))
            }
        }
    }

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendCard userIdFrom={currentUser?.id} userTo={item} />
    }

    return <View style={{ backgroundColor: Colors.pastelGreen, flex: 1 }}>
        <TextInput value={searchInput} placeholder="Search for your friend's username 🔍" style={styles.textfieldText}
            onPressOut={async () => {
                await Contacts.requestPermissionsAsync();
            }}
            onChangeText={setSearchInput} onSubmitEditing={submitSearch} />
        <View style={[styles.container, { alignItems: 'stretch' }]}>
            {data?.length === 0 && <Text style={styles.textfieldText}>No results</Text>}
            <FlatList
                data={data}
                keyExtractor={(user: UserRecord) => user.id}
                renderItem={renderFriend}
            />
        </View>
    </View>
}