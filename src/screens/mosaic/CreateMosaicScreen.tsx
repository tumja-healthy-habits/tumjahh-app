import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LoginButton from "components/authentication/LoginButton";
import IconButton from "components/misc/IconButton";
import PictureInput from "components/misc/PictureInput";
import ProfilePicture from "components/profile/ProfilePicture";
import Colors from "constants/colors";
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Divider, TextInput } from "react-native-paper";
import { MosaicParamList } from "screens/mosaic/MosaicNavigator";
import { pb, useRealTimeCollection } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { FixedDimensionImage, FriendsWithRecord, MosaicMembersRecord, MosaicRecord, UserRecord } from "types";


export default function CreateMosaicScreen() {

    const { currentUser } = useAuthenticatedUser()
    if (currentUser === null) return <View />

    const { goBack } = useNavigation<NavigationProp<MosaicParamList, "CreateMosaic">>()


    const [thumbnail, setThumbnail] = useState<FixedDimensionImage>()
    const [mosaicName, setMosaicName] = useState<string>("")
    const [members, setMembers] = useState<UserRecord[]>([currentUser])
    const [searchText, setSearchText] = useState<string>("")
    const [searchResults, setSearchResults] = useState<UserRecord[]>([]);
    const [updateSearch, setUpdateSearch] = useState<boolean>(false)



    function getFriend(record: FriendsWithRecord): UserRecord {
        if (currentUser === null) throw new Error("Current user is null")
        return record.user1 === currentUser.id ? record.expand.user2 : record.expand.user1
    }

    const friends: UserRecord[] = useRealTimeCollection<FriendsWithRecord>("friends_with", [], { expand: "user1, user2" }).map(getFriend)


    useEffect(() => {
        submitSearch()
    }, [searchText])


    async function submitSearch() {
        if (currentUser === null) {
            return
        }
        setSearchResults(friends.filter((friend: UserRecord) => { return (friend.username.toLowerCase().startsWith(searchText.toLowerCase()) || friend.name.toLowerCase().startsWith(searchText.toLowerCase())) }))
    }

    function renderMember({ item }: ListRenderItemInfo<UserRecord>) {
        return (
            <View style={styles.memberContainer}>
                <ProfilePicture userRecord={item} style={styles.memberImage} />
                {/* Current user can't be deleted as member of mosaic he creates */}
                {item != currentUser && <Ionicons name="ellipse" size={25} color="white" style={styles.overlay} />}
                {item != currentUser && <IconButton icon="close-circle" size={25} color="black" onPress={() => removeMember(item)} style={styles.overlay} />}
                <Text>{item.name}</Text>
            </View>
        )
    }

    function isMember(user: UserRecord) {
        return members.includes(user)
    }

    function renderFriendSearch({ item }: ListRenderItemInfo<UserRecord>) {
        return (
            <TouchableOpacity style={styles.searchContainer} onPress={() => addMember(item)}>
                <ProfilePicture userRecord={item} style={styles.searchImage} />
                <View style={styles.innerContainer}>
                    <Text style={styles.searchName}>{item.name}</Text>
                    <Text style={styles.searchUsername}>{item.username}</Text>
                </View>
                {/* <IconButton icon={!isMember(item) ? "ellipse-outline" : "checkmark-circle"} color={Colors.black} size={40} onPress={!isMember(item) ? () => addMember(item) : () => removeMember(item)}/> */}
            </TouchableOpacity>
        )
    }

    function addMember(newMember: UserRecord) {
        if (!isMember(newMember)) {
            setMembers(members.concat([newMember]))
            setUpdateSearch(!updateSearch)
        }
    }

    function removeMember(toRemove: UserRecord) {
        var temp = members
        var index = temp.indexOf(toRemove)
        temp.splice(index, 1);
        setMembers(temp)
        setUpdateSearch(!updateSearch)
    }

    async function createMosaicMemberRecord(user: UserRecord, mosaic: MosaicRecord) {
        const formData: FormData = new FormData()
        formData.append("user_id", user.id)
        formData.append("mosaic_id", mosaic.id)
        const mosaicMemberRecord = await pb.collection("mosaic_members").create<MosaicMembersRecord>(formData)
    }

    async function handleCreateMosaic() {
        if (mosaicName === "") {
            Alert.alert("Please give your mosaic a name")
            return
        }
        try {
            const formData: FormData = new FormData()
            formData.append("name", mosaicName)
            thumbnail !== undefined ? formData.append('thumbnail', {
                uri: thumbnail!.uri,
                name: thumbnail!.uri,
                type: "image/jpg"
            } as any) : {}
            console.log(formData)
            var mosaicRecord = await pb.collection("mosaics").create<MosaicRecord>(formData)
            members.map((user: UserRecord) => { createMosaicMemberRecord(user, mosaicRecord) })
        }
        catch (error: any) {
            console.log(error.response)
            if ("name" in error.response.data) {
                if (error.response.data.name.code == "validation_not_unique") {
                    Alert.alert("Mosaic name already exists. \n Please choose a different one")
                }
            }
        }
        goBack()
    }

    return (
        <SafeAreaView style={styles.outerContainer}>
            <IconButton icon="chevron-back-outline" onPress={goBack} color="#666" size={30} style={{ alignSelf: "flex-start" }} />
            <Text style={styles.formTitle}>Create Mosaic</Text>
            <View style={styles.innerContainer}>

                <View style={styles.horizontalContainer}>
                    <PictureInput
                        label=""
                        onTakePhoto={setThumbnail}
                        picture={thumbnail}
                        defaultPicture={require("assets/images/default-mosaic.png")}
                        imageStyle={{ width: 60, height: 60, borderWidth: 2, }}
                        iconSize={30}
                        iconColor={"white"}
                        style={{ marginRight: 15, }}
                        iconStyle={{ backgroundColor: "#666", borderRadius: 5, paddingHorizontal: 2 }}
                    />
                    <TextInput
                        placeholder="Mosaic Name"
                        style={styles.textInput}
                        value={mosaicName}
                        onChangeText={setMosaicName}
                        dense={true}
                    />
                </View>
                <View>
                    <Text style={{ fontSize: 20 }}>Members:</Text>

                    <FlatList
                        data={members}
                        keyExtractor={(user: UserRecord) => user.id}
                        renderItem={renderMember}
                        scrollEnabled={true}
                        horizontal={true}
                        style={{ marginBottom: 10, height: 100, }}
                        showsHorizontalScrollIndicator={false}
                        extraData={updateSearch}
                    />
                </View>
                <View style={styles.searchView}>
                    <TextInput value={searchText}
                        placeholder="Search friends"
                        onChangeText={setSearchText}
                        autoCapitalize="none"
                        autoCorrect={false}
                        left={<TextInput.Icon icon={() => <Ionicons name="search-outline" size={24} color="black" />} />}
                        style={{ backgroundColor: "transparent", marginBottom: 5, }}
                        dense={true}
                    />

                    <FlatList
                        data={searchResults}
                        keyExtractor={(user: UserRecord) => user.id}
                        renderItem={renderFriendSearch}
                        ItemSeparatorComponent={() => <Divider bold horizontalInset />}
                        style={{ marginBottom: 20, flexGrow: 0 }}
                        extraData={updateSearch}
                    />
                </View>
                <LoginButton label={"Create Mosaic"} onPress={handleCreateMosaic} color="white" />
                {/* style={{position:"absolute", bottom:20}}/> */}

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: Colors.backgroundProfile,
        flex: 1,
        alignItems: "center",
        paddingLeft: 50
    },
    innerContainer: {
        width: "90%",
        flex: 1,
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: "center",
        height: "10%",
        marginTop: 20,
        marginBottom: 40
    },
    formTitle: {
        color: Colors.accent,
        fontSize: 30,
        marginTop: 10,
        //marginBottom: 10,
        marginLeft: 20,
        alignSelf: 'flex-start'
    },
    textInput: {
        fontSize: 20,
        borderBottomColor: '#666',
        //borderBottomWidth:1,
        width: "78%",
        alignSelf: "flex-end",
        backgroundColor: "transparent"
    },
    searchView: {
        height: "45%"

    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        //padding: 10,
        //margin: 10,
        marginHorizontal: 15
    },
    searchInnerContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        marginLeft: 10,
    },
    searchName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    searchUsername: {
        fontSize: 14,
    },
    searchImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
    },
    memberImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderWidth: 1
    },
    memberContainer: {
        alignItems: "center"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        marginLeft: 55
        //position:"absolute",
        //top:10,

    },
})