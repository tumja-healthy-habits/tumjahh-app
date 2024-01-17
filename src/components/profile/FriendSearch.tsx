import { Ionicons } from "@expo/vector-icons";
import Colors from "constants/colors";
import { Contact, Fields as ContactFields, PermissionStatus, PhoneNumber, getContactsAsync, requestPermissionsAsync } from "expo-contacts";
import React, { useEffect, useState, } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { Divider, TextInput, Tooltip } from "react-native-paper";
import { pb, useRealTimeCollection } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles } from "src/styles";
import { UserRecord, FriendsWithRecord, FriendRequestsRecord } from "types";
import FriendSearchResult from "./FriendSearchResult";

type FriendSearchProps = {
    showQRCode: () => void
    searchText: string,
    setSearchText: (text: string) => void
}

export default function FriendSearch({ showQRCode, searchText, setSearchText }: FriendSearchProps) {
    const [searchResults, setSearchResults] = useState<UserRecord[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false)
    const [updateFlag, setUpdateFlag] = useState<boolean>(false)

    const { currentUser } = useAuthenticatedUser()

    useEffect(() => {
        submitSearch()
    }, [searchText])

    async function submitSearch() {
        if (currentUser === null || searchText.length === 0) {
            setShowResults(false)
            setSearchResults([])
            return
        }
        setShowResults(true)
        
        const foundByUsername: UserRecord[] = (await pb.collection("users").getFullList<UserRecord>({
            filter: `username ~ "${searchText}" && id != "${currentUser.id}"`,
            expand: "friend_requests(from).to, friend_requests(to).from, friends_with(user2).user1, friends_with(user1)"
        }))

        // contacts permission
        const { status } = await requestPermissionsAsync()
        if (status === PermissionStatus.GRANTED) {
            // getting contacts
            const { data } = await getContactsAsync({
                name: searchText,
                fields: [ContactFields.PhoneNumbers]
            })
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
            if (phoneNumberQuery.length === 0) {
                setSearchResults(foundByUsername)
                return
            }
            // Matching phone numbers
            pb.collection("users").getFullList<UserRecord>({
                filter: `username !~ "${searchText}" && (${phoneNumberQuery})`,
                expand: "friend_requests(from).to, friend_requests(to).from, friends_with(user2).user1, friends_with(user1)"
            }).then((records: UserRecord[]) => {
                // console.log("found by phone numbers", records)
                setSearchResults(foundByUsername.concat(records))
            }).catch(console.error)
        }
        else {
            setSearchResults(foundByUsername)
        }
    }

    function updateSearchResult(user: UserRecord): void {
        pb.collection("users").getOne<UserRecord>(user.id, {
            expand: "friend_requests(from).to, friend_requests(to).from, friends_with(user2).user1, friends_with(user1)"
        }).then((updatedUser: UserRecord) => {
            setSearchResults((oldResults: UserRecord[]) => oldResults.map((result: UserRecord) => {
                if (result.id === updatedUser.id) {
                    return updatedUser
                }
                return result
            }))
        }).catch(console.error)
        setUpdateFlag(!updateFlag)
    }

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendSearchResult user={item} updateSearchResult={updateSearchResult} />
    }

    return <View style={{ backgroundColor: Colors.backgroundProfile, paddingBottom:50 }
    }>
        <TextInput value={searchText}
            placeholder="Search for your friend's username"
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon={() => <Ionicons name="search-outline" size={24} color="black" />} />}
            // right={<TextInput.Icon icon={() => <Tooltip title="Show QR code"><Ionicons name="qr-code-outline" size={24} color="black" onPress={showQRCode} /></Tooltip>} />}
            style={{ backgroundColor: "transparent", marginHorizontal: 10 }}

        />
        {showResults ? (<FlatList
            data={searchResults}
            keyExtractor={(user: UserRecord) => user.id}
            renderItem={renderFriend}
            ItemSeparatorComponent={() => <Divider bold horizontalInset />}
            extraData={updateFlag}
        />) : searchText.length > 0 ?
            (<Text style={globalStyles.textfieldText}>No results</Text>
            ) : null}
    </View >
}