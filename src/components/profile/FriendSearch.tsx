import { Ionicons } from "@expo/vector-icons";
import Colors from "constants/colors";
import { Contact, Fields as ContactFields, PermissionStatus, PhoneNumber, getContactsAsync, requestPermissionsAsync } from "expo-contacts";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { Divider, TextInput, Tooltip } from "react-native-paper";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles } from "src/styles";
import { UserRecord } from "types";
import FriendSearchResult from "./FriendSearchResult";

type FriendSearchProps = {
    showQRCode: () => void
}

export default function FriendSearch({ showQRCode }: FriendSearchProps) {
    const [searchInput, setSearchInput] = useState<string>("")
    const [searchResults, setSearchResults] = useState<UserRecord[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false)

    const { currentUser } = useAuthenticatedUser()

    console.log(searchResults, "\nshowing results: ", showResults)

    useEffect(() => {
        submitSearch()
    }, [searchInput])

    async function submitSearch() {
        if (searchInput.length === 0 || currentUser === undefined) {
            setShowResults(false)
            setSearchResults([])
            return
        }
        // USERS
        setShowResults(true)
        const foundByUsername: UserRecord[] = (await pb.collection("users").getFullList<UserRecord>({
                filter: `username ~ "${searchInput}" && id != "${currentUser.id}"`
            }))

        // contacts permission
        const { status } = await requestPermissionsAsync()
        if (status === PermissionStatus.GRANTED) {
            // getting contacts
            const { data } = await getContactsAsync({
                name: searchInput,
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
                filter: `username !~ "${searchInput}" && (${phoneNumberQuery})`
            }).then((records: UserRecord[]) => {
                // console.log("found by phone numbers", records)
                setSearchResults(foundByUsername.concat(records))
            }).catch(console.error)
        }
    }

    function renderFriend({ item }: ListRenderItemInfo<UserRecord>) {
        return <FriendSearchResult user={item} />
    }

    return <View style={{ backgroundColor: Colors.pastelGreen, flex: 1 }
    }>
        <TextInput value={searchInput}
            placeholder="Search for your friend's username"
            onChangeText={setSearchInput}
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon={() => <Ionicons name="search-outline" size={24} color="black" />} />}
            right={<TextInput.Icon icon={() => <Tooltip title="Show QR code"><Ionicons name="qr-code-outline" size={24} color="black" onPress={showQRCode} /></Tooltip>} />}
            style={{ backgroundColor: Colors.pastelGreen, marginHorizontal: 10 }}

        />
        {showResults ? (<FlatList
            data={searchResults}
            keyExtractor={(user: UserRecord) => user.id}
            renderItem={renderFriend}
            ItemSeparatorComponent={() => <Divider bold horizontalInset />}
        />) : searchInput.length > 0 ?
            (<Text style={globalStyles.textfieldText}>No results</Text>
            ) : null}
    </View >
}