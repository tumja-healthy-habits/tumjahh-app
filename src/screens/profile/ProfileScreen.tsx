import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LoginForm from "components/authentication/LoginForm";
import ActionButton from "components/misc/ActionButton";
import ProfilePicture from "components/profile/ProfilePicture";
import Colors from "constants/colors";
import { ImagePickerAsset, ImagePickerResult, MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper"
import { VAR_USERNAME, logout } from "src/authentification";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles, imageStyles } from "src/styles";
import { FixedDimensionImage } from "types";
import { UserRecord } from "types";
import { ProfileParamList } from "./ProfileNavigator";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "components/misc/IconButton";


export default function ProfileScreenAlt() {
    const { currentUser, setCurrentUser } = useAuthenticatedUser()
    const { navigate } = useNavigation<NavigationProp<ProfileParamList, "ProfilePage">>()

    if (currentUser === null) {
        return <LoginForm />
    }

    const [name, setName] = useState<string>(currentUser.name)
    const [photoUri, setPhotoUri] = useState<string | undefined>(currentUser.avatar ? pb.getFileUrl(currentUser, currentUser.avatar) : undefined)
    const [editMode, setEditMode] = useState<boolean>(false)

    async function handleTapProfilePicture(): Promise<void> {
        launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.2,
            allowsMultipleSelection: false,
            aspect: [1, 1],
        }).then((result: ImagePickerResult) => {
            if (result.canceled) return
            // updateUser(result.assets[0])
            setPhotoUri(result.assets[0].uri)
        })
    }

    function handleDiscardChanges() {
        setName(currentUser!.name)
        setPhotoUri(currentUser!.avatar ? pb.getFileUrl(currentUser!, currentUser!.avatar) : undefined)
        setEditMode(false)
    }

    function handleTapLogout() {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            {text: 'Cancel', onPress: () => {}, style: 'cancel',},
            {text: 'Logout', style:"destructive", onPress: logout},
          ]);
    }

    async function updateUser() {
        if (currentUser === null) return
        const updateData: FormData = new FormData()
        updateData.append("name", name)
        if (photoUri != currentUser.avatar) {
            console.log("before compressing image")
            //const compressedImageUrl = await compressedImage(photoUri!, 0.7)
            //console.log(compressedImageUrl)
            updateData.append("avatar", {
                uri: photoUri,
                name: photoUri,
                type: "image/jpg"
            } as any)
        }
        console.log(updateData)
        pb.collection("users").update<UserRecord>(currentUser.id, updateData)
            .then((newRecord: UserRecord) => {
                Alert.alert("Successfully updated")
                setCurrentUser(newRecord)
                // update the username in the local storage
                if (newRecord.username !== currentUser.username) {
                    AsyncStorage.setItem(VAR_USERNAME, newRecord.username)
                }
            }).catch(() => {
                Alert.alert("Something went wrong while trying to update.\n Please try again")
            })
        setEditMode(false)
    }

    return (
        <SafeAreaView style={[globalStyles.container, { backgroundColor: Colors.backgroundProfile }]}>
            <Text style={styles.username}>{currentUser.username}</Text>
            {editMode ?
                <View>
                    <ProfilePicture uri={photoUri} style={[styles.profilePicture, { borderColor: "transparent" }]} />

                    <View style={styles.overlay}>
                        <IconButton icon="create-outline" size={80} color="white" onPress={handleTapProfilePicture} style={{borderRadius:10, backgroundColor:"#666", paddingHorizontal:2,}}/>
                    </View>
                    
                </View>
                : <ProfilePicture uri={photoUri} style={[styles.profilePicture, { borderColor: "transparent" }]} />
            }
            
            {editMode ?  
                <TextInput 
                    value={name}
                    onChangeText={setName} 
                    style={styles.textInput} 
                    label="Display name"
                    autoCapitalize="none"
                    autoCorrect={false}
                    right={<TextInput.Icon icon={() => <Ionicons name="create-outline" size={24} color="black" />}/>}
                />
                : <Text style={styles.name}>{name}</Text>
            }
            <Text>{currentUser.email}</Text>
            {/* <TextInput value={email} onChangeText={setEmail} style={globalStyles.textfieldText} /> */}
            {/* <Button title="Save changes" onPress={() => updateUser(undefined)} disabled={!hasChanged} /> */}
            {/* <ActionButton title="Log out" onPress={logout} /> */}
            {/* <ActionButton title="Add friends" onPress={() => navigate("SearchFriend", { friendId: undefined })} /> */}

            {editMode ? 
                <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={handleDiscardChanges}>
                        <Ionicons name="close-outline" size={40} />
                        <Text style={styles.buttonText}>Discard changes</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={updateUser}>
                        <Ionicons name="lock-closed" size={40} />
                        <Text style={styles.buttonText}>Save changes</Text>
                    </Pressable>
                </View>
                : <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={() => navigate("SearchFriend", { friendId: undefined })}>
                        <Ionicons name="people" size={40}/>
                        <Text style={styles.buttonText}>Friends</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => setEditMode(true)}>
                        <Ionicons name="create-outline" size={40} />
                        <Text style={styles.buttonText}>Edit</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleTapLogout}>
                        <Ionicons name="log-out-outline" size={40} />
                        <Text style={styles.buttonText}>Log out</Text>
                    </Pressable>
                </View>
            }

            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    username: {
        color: Colors.accent,
        fontSize: 25,
        marginBottom:20
    },
    textInput: {
        backgroundColor: Colors.backgroundProfile,
        borderBottomColor: "transparent",
        borderBottomWidth:0,
        width:"70%"
    },
    profilePicture: {
        width:200,
        height:200,
        marginBottom:10
    },
    name: {
        fontSize:20,
        marginBottom:5
    },
    button:{
        width:80,
        height:80,
        alignItems:"center",
        marginHorizontal:5
    },
    buttonText: {
        textAlign:"center"
    },
    buttonView: {
        flexDirection:"row",
        marginTop:50
    },
    overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
})