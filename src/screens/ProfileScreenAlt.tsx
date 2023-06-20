import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ActionButton from "components/ActionButton";
import LoginForm from "components/LoginForm";
import ProfilePicture from "components/ProfilePicture";
import Colors from "constants/colors";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { VAR_USERNAME, logout } from "src/authentification";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { imageStyles, styles } from "src/styles";
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

    const hasChanged: boolean = name !== currentUser.name || username !== currentUser.username || email !== currentUser.email

    async function updateUser() {
        if (currentUser === null) return
        pb.collection("users").update<UserRecord>(currentUser.id, {
            name,
            username,
            email,
        }).then((newRecord: UserRecord) => {
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
        <View style={[styles.container, { backgroundColor: Colors.backgroundProfile }]}>
            <TextInput value={name} onChangeText={setName} style={styles.textfieldText} />
            <ProfilePicture user={currentUser} style={[imageStyles.profilePicture, { borderColor: "transparent" }]} />
            <TextInput value={username} onChangeText={setUsername} style={styles.textfieldText} />
            <TextInput value={email} onChangeText={setEmail} style={styles.textfieldText} />
            <Button title="Save changes" onPress={updateUser} disabled={!hasChanged} />
            <ActionButton title="Log out" onPress={logout} />
            <ActionButton title="Add friends" onPress={() => navigate("SearchFriend", { friendId: undefined })} />
        </View>
    )
}