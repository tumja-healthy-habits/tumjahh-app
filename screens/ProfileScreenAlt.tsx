import Colors from "constants/colors";
import LoginForm from "components/LoginForm";
import ProfilePicture from "components/ProfilePicture";
import { useState } from "react";
import { View, TextInput, StyleSheet, Button, Alert } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import { UserRecord } from "types";
import { styles, imageStyles } from "src/styles";
import { VAR_USERNAME, logout } from "src/authentification";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreenAlt() {
    const { currentUser, setCurrentUser } = useAuthenticatedUser()

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
        <View style={styles.container}>
            <TextInput value={name} onChangeText={setName} style={styles.textfieldText} />
            <ProfilePicture user={currentUser} style={imageStyles.profilePicture} />
            <TextInput value={username} onChangeText={setUsername} style={styles.textfieldText} />
            <TextInput value={email} onChangeText={setEmail} style={styles.textfieldText} />
            <Button title="Save changes" onPress={updateUser} disabled={!hasChanged} />
            <Button title="Log out" onPress={logout} color={Colors.accent}></Button>
        </View>
    )
}