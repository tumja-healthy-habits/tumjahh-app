import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LoginForm from "components/authentication/LoginForm";
import ActionButton from "components/misc/ActionButton";
import ProfilePicture from "components/profile/ProfilePicture";
import Colors from "constants/colors";
import { ImagePickerAsset, ImagePickerResult, MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, Pressable, SafeAreaView, TextInput } from "react-native";
import { VAR_USERNAME, logout } from "src/authentification";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles, imageStyles } from "src/styles";
import { UserRecord } from "types";
import { ProfileParamList } from "./ProfileNavigator";


export default function ProfileScreenAlt() {
    const { currentUser, setCurrentUser } = useAuthenticatedUser()
    const { navigate } = useNavigation<NavigationProp<ProfileParamList, "ProfilePage">>()

    if (currentUser === null) {
        return <LoginForm />
    }

    const [name, setName] = useState<string>(currentUser.name)
    const [username, setUsername] = useState<string>(currentUser.username)
    const [email, setEmail] = useState<string>(currentUser.email)
    const [photoUri, setPhotoUri] = useState<string | undefined>(currentUser.avatar ? pb.getFileUrl(currentUser, currentUser.avatar) : undefined)

    const hasChanged: boolean = name !== currentUser.name || username !== currentUser.username || email !== currentUser.email

    async function handleTapProfilePicture(): Promise<void> {
        launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
            allowsMultipleSelection: false,
        }).then((result: ImagePickerResult) => {
            if (result.canceled) return
            updateUser(result.assets[0])
            setPhotoUri(result.assets[0].uri)
        })
    }

    async function updateUser(photo?: ImagePickerAsset) {
        if (currentUser === null) return
        const updateData: FormData = new FormData()
        updateData.append("name", name)
        updateData.append("username", username)
        updateData.append("email", email)
        if (photo !== undefined) {
            updateData.append("avatar", {
                uri: photo.uri,
                name: photo.uri,
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
    }

    return (
        <SafeAreaView style={[globalStyles.container, { backgroundColor: Colors.backgroundProfile }]}>
            <TextInput value={name} onChangeText={setName} style={globalStyles.textfieldText} />
            <Pressable onPress={handleTapProfilePicture}>
                <ProfilePicture uri={photoUri} style={[imageStyles.profilePicture, { borderColor: "transparent" }]} />
            </Pressable>
            <TextInput value={username} onChangeText={setUsername} style={globalStyles.textfieldText} />
            <TextInput value={email} onChangeText={setEmail} style={globalStyles.textfieldText} />
            <Button title="Save changes" onPress={() => updateUser(undefined)} disabled={!hasChanged} />
            <ActionButton title="Log out" onPress={logout} />
            <ActionButton title="Add friends" onPress={() => navigate("SearchFriend", { friendId: undefined })} />
        </SafeAreaView>
    )
}