import Colors from "constants/colors";
import { Contact, Fields as ContactFields, PermissionStatus, PhoneNumber, getContactsAsync, getPermissionsAsync, requestPermissionsAsync } from "expo-contacts";
import { useState } from "react";
import { FlatList, ListRenderItemInfo, Text, TextInput, View } from "react-native";
import { Divider } from "react-native-paper";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { styles } from "src/styles";
import { UserRecord } from "types";
import FriendSearchResult from "./FriendSearchResult";

export default function FriendSearch() {
    // const navigation = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()
    const { currentUser } = useAuthenticatedUser()
    const [searchInput, setSearchInput] = useState<string>("")
    const [searchResults, setSearchResults] = useState<UserRecord[]>([]);

    async function submitSearch() {
        console.log("searching")

        if (searchInput.length > 0) {
            // USERS

            const foundByUsername: UserRecord[] = (await pb.collection("users").getFullList<UserRecord>({
                filter: `username ~ "${searchInput}"`
            }))
            console.log("found by username", foundByUsername.map((user: UserRecord) => user.username))

            // CONTACTS

            // contacts permission
            const { status } = await getPermissionsAsync()
            if (status === PermissionStatus.GRANTED) {
                // getting contacts
                const { data } = await getContactsAsync({
                    name: searchInput,
                    fields: [ContactFields.PhoneNumbers]
                })

                console.log("contacts", data)

                // extracting numbers from contacts --> creating filter
                const phoneNumberQuery: string = data.map((contact: Contact) => {
                    // extracting phone numbers
                    if (contact.phoneNumbers === undefined) return null
                    return contact.phoneNumbers.map(
                        (numberEntry: PhoneNumber) => {
                            // unpacking and formatting number
                            if (numberEntry.number === undefined) return null
                            let number: string = numberEntry.number.replaceAll(/[^+0-9]/g, "")
                            // checking for country code (+49 fallback)
                            if (number.startsWith("00")) {
                                number = "+" + number.substring(2)
                            } else if (number.startsWith("0")) {
                                number = "+49" + number.substring(1)
                            } else if (!number.startsWith("+")) {
                                number = "+49" + number
                            }
                            return `phoneNumber = "${number}"`
                        }
                    )
                }
                ).flat()
                    .filter((number: string | null) => number != null)
                    .join(" || ")
                console.log("query: ", phoneNumberQuery)
                if (phoneNumberQuery.length === 0) {
                    setSearchResults(foundByUsername)
                    return
                }
                // Matching phone numbers
                pb.collection("users").getFullList<UserRecord>({
                    filter: `username !~ "${searchInput}" || (${phoneNumberQuery})`
                }).then((records: UserRecord[]) => {
                    console.log("found by phone numbers", records)
                    setSearchResults(foundByUsername.concat(records))
                }).catch(console.error)
            }
        }
    }

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendSearchResult user={item} />
    }

    return <View style={{ backgroundColor: Colors.pastelGreen, flex: 1 }}>
        <TextInput value={searchInput} placeholder="Search for your friend's username 🔍" style={styles.textfieldText}
            onPressOut={requestPermissionsAsync}
            onChangeText={setSearchInput}
            onSubmitEditing={submitSearch}
            autoCapitalize="none"
            autoCorrect={false} />
        <View style={[styles.container, { alignItems: 'stretch' }]}>
            {searchResults.length === 0 ?
                (<Text style={styles.textfieldText}>No results</Text>
                ) : (<FlatList
                    data={searchResults}
                    keyExtractor={(user: UserRecord) => user.id}
                    renderItem={renderFriend}
                    ItemSeparatorComponent={() => <Divider bold horizontalInset />}
                />)}
        </View>
    </View>
}