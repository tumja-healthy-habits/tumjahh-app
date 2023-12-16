import {Alert, SafeAreaView, StyleSheet, Text, View, FlatList, ListRenderItemInfo,  ImageSourcePropType, TouchableOpacity} from "react-native";
import React, { useState, useRef, useEffect} from 'react';
import Colors from "constants/colors";
import PictureInput from "components/misc/PictureInput";
import { FixedDimensionImage, MosaicMembersRecord, UserRecord, MosaicRecord, FriendsWithRecord } from "types";
import ProfilePicture from "components/profile/ProfilePicture";
import LoginButton from "components/authentication/LoginButton";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MosaicParamList } from "./MosaicNavigator";
import { pb } from "src/pocketbaseService";
import {TextInput, Divider,} from "react-native-paper"
import { Ionicons } from "@expo/vector-icons";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRealTimeCollection } from 'src/pocketbaseService';
import IconButton from "components/misc/IconButton";




export default function EditMosaicScreen() {

    const { currentUser } = useAuthenticatedUser()
    if (currentUser === null) return

    const { goBack } = useNavigation<NavigationProp<MosaicParamList, "CreateMosaic">>()

    const [mosaicRecord, setMosaicRecord] = useState<MosaicRecord>()
    const [thumbnail, setThumbnail] = useState<FixedDimensionImage>()
    const [mosaicName, setMosaicName] = useState<string>()
    const [oldMembers, setOldMembers] = useState<UserRecord[]>([])
    const [members, setMembers] = useState<UserRecord[]>([])
    const [searchText, setSearchText] = useState<string>("")
    const [searchResults, setSearchResults] = useState<UserRecord[]>([]);
    const [updateSearch, setUpdateSearch] = useState<boolean>(false)

    const friends: UserRecord[] = useRealTimeCollection<FriendsWithRecord>("friends_with", [], { expand: "user1, user2" }).map(getFriend)
    const { params } = useRoute<RouteProp<MosaicParamList, "EditMosaic">>()
    
    useEffect(() => {
        pb.collection("mosaics").getOne<MosaicRecord>(params.mosaicId).then(
            (mosaic:MosaicRecord) => {
                setMosaicRecord(mosaic);
                setThumbnail({"uri": pb.getFileUrl(mosaic, mosaic.thumbnail), "height":100, "width":100})
                setMosaicName(mosaic.name)
            })
        
        pb.collection("mosaic_members").getFullList<MosaicMembersRecord>({filter: `mosaic_id = "${params.mosaicId}"`, expand: "user_id"})
        .then((records:MosaicMembersRecord[]) => {setMembers(records.map(getMember)); setOldMembers(records.map(getMember))})            
    }, [])
    
    useEffect(() => {
        submitSearch()
    }, [searchText])
    
    function getMember(record: MosaicMembersRecord) : UserRecord {
        return record.expand.user_id
    }   
    
    function getFriend(record: FriendsWithRecord): UserRecord {
        if (currentUser === null) throw new Error("Current user is null")
        return record.user1 === currentUser.id ? record.expand.user2 : record.expand.user1
    }

    async function submitSearch() {
        if (currentUser === null) {
            return
        }
        setSearchResults(friends.filter((friend:UserRecord) => {return (friend.username.startsWith(searchText) || friend.name.startsWith(searchText))}))
    }

    function renderMember({ item }: ListRenderItemInfo<UserRecord>) {
        return (
        <View style={styles.memberContainer}>
            <ProfilePicture userRecord={item} style={styles.memberImage}/>
            {/* Current user can't be deleted as member of mosaic he creates */}
            {item.id != currentUser!.id && <Ionicons name="ellipse" size={25} color="white" style={styles.overlay}/>}
            {item.id != currentUser!.id && <IconButton icon="close-circle" size={25} color="black" onPress={() => removeMember(item)} style={styles.overlay} />}
            <Text>{item.name}</Text>
        </View>
        )
    }

    function isMember(user:UserRecord) {
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

    async function createMosaicMemberRecord(user: UserRecord) {
        const formData: FormData = new FormData()
        formData.append("user_id", user.id)
        formData.append("mosaic_id", mosaicRecord!.id)
        const mosaicMemberRecord = await pb.collection("mosaic_members").create<MosaicMembersRecord>(formData)
    }

    async function deleteMosaicMemberRecord(user: UserRecord) {
        var record = await pb.collection("mosaic_members").getFirstListItem<MosaicMembersRecord>(`mosaic_id = "${mosaicRecord!.id}" && user_id = "${user.id}"`)
        if (record === undefined) {
            console.log("ERROR, no record for this mosaic and this user")
            return
        }
        await pb.collection("mosaic_members").delete(record.id)
        
    }


    async function handleSaveChanges() {
        if (mosaicRecord === undefined) {
            console.log("ERROR, mosaicRecord undefined")
            return
        }

        const formData: FormData = new FormData()
        formData.append("name", mosaicName!)
        thumbnail !== undefined ? formData.append('thumbnail', {
            uri: thumbnail!.uri,
            name: thumbnail!.uri,
            type: "image/jpg"
        } as any) : {}

        await pb.collection("mosaics").update(mosaicRecord.id, formData).catch((error) => {console.log(error.message)})
        
        //add new members
        members.map((user) => {!oldMembers.includes(user) ? createMosaicMemberRecord(user) : {}})
        
        //delete members
        oldMembers.map((user) => {!members.includes(user) ? deleteMosaicMemberRecord(user) : {}})

        goBack()
    }

    async function leaveMosaic() {
        deleteMosaicMemberRecord(currentUser!)
        goBack()
    }

    function handleLeaveMosaic() {

        Alert.alert('Leave Mosaic', 'Are you sure you want to leave ' + mosaicName + "?", [
            {text: 'Cancel', onPress: () => {}, style: 'cancel',},
            {text: 'Leave', style:"destructive", onPress: leaveMosaic},
          ]);

    }

    return (
        <SafeAreaView style={styles.outerContainer}>
            <Text style={styles.formTitle}>Edit Mosaic</Text>
            <View style={styles.innerContainer}>

                <View style={styles.horizontalContainer}>
                    <PictureInput 
                        label=""
                        onTakePhoto={setThumbnail} 
                        picture={thumbnail}
                        defaultPicture={require("assets/images/default-mosaic.png")}
                        imageStyle={{width:60, height:60, borderWidth:2,}}
                        iconSize={30}
                        iconColor={"white"}
                        style={{marginRight:15,}}
                        iconStyle={{backgroundColor:"#666", borderRadius:5, paddingHorizontal:2}}
                    />
                    <TextInput 
                        placeholder="Mosaic Name" 
                        style={styles.textInput}
                        onChangeText={setMosaicName}
                        defaultValue={mosaicName}
                        dense={true}/>
                </View>

                <View>
                    <Text style={{fontSize:20, marginBottom:5}}>Members:</Text>
                    
                    <FlatList
                        data={members}
                        keyExtractor={(user: UserRecord) => user.id}
                        renderItem={renderMember} 
                        scrollEnabled={true}
                        horizontal={true}
                        style={{marginBottom:10, height:100,}}
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
                
                <LoginButton label={"Save changes"} onPress={handleSaveChanges} color="white" style={{position:"absolute", bottom:45}}/>
                
                <TouchableOpacity onPress={handleLeaveMosaic} style={{position:"absolute", bottom:12, alignSelf:"center"}}>
                    <Text style={{fontSize:16, color:"#F56E6E", fontWeight:"500"}}>Leave Mosaic</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: Colors.backgroundProfile,
        flex:1,
        alignItems:"center", 
        //paddingLeft:50
    },
    innerContainer: {
        width:"90%",
        flex:1,
    },
    horizontalContainer:{
        flexDirection:'row',
        alignItems:"center",
        height:"10%",
        marginTop:20, 
        marginBottom:40
    },
    formTitle: {
        color: Colors.accent,
        fontSize: 30,
        marginTop:30,
        //marginBottom: 10,
        marginLeft:20,
        alignSelf:'flex-start'
    },
    textInput:{
        fontSize:20,
        borderBottomColor:'#666',
        //borderBottomWidth:1,
        width:"78%",
        alignSelf:"flex-end",
        backgroundColor:"transparent"
    },
    searchView: {
        height:"40%"
        
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        //padding: 10,
        //margin: 10,
        marginHorizontal:15
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
        width:60, 
        height:60,
        borderRadius:8,
        borderWidth:1
    },
    memberContainer: {
        alignItems:"center"
    },
    overlay: {
		...StyleSheet.absoluteFillObject,
        marginLeft:55
        //position:"absolute",
		//top:10,
          
	},
})