import Colors from "constants/colors";
import LoginForm from "components/LoginForm";
import ProfilePicture from "components/ProfilePicture";
import { useState } from "react";
import { View, TextInput, StyleSheet, Button, Alert } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import { UserRecord } from "types";
import { styles, imageStyles } from "src/styles";

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
        const newRecord: UserRecord = await pb.collection("users").update<UserRecord>(currentUser.id, {
            name,
            username,
            email,
        })
        const hasUpdated: boolean = currentUser.name !== newRecord.name || currentUser.username !== newRecord.username || currentUser.email !== newRecord.email
        Alert.alert(hasUpdated ? "Successfully updated" : "Something went wrong. Please try again")
        setCurrentUser(newRecord)
    }

    return (
        <View style={styles.container}>
            <TextInput value={name} onChangeText={setName} style={styles.textfieldText} />
            <ProfilePicture user={currentUser} style={imageStyles.profilePicture} />
            <TextInput value={username} onChangeText={setUsername} style={styles.textfieldText} />
            <TextInput value={email} onChangeText={setEmail} style={styles.textfieldText} />
            <Button title="Save changes" onPress={updateUser} disabled={!hasChanged} />
            <Button title="Log out" onPress={async () => { await pb.authStore.clear() }} color={Colors.accent}></Button>
        </View>
    )
}