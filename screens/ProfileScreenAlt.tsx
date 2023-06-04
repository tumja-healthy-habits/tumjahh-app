import Colors from "constants/colors";
import LoginForm from "components/LoginForm";
import ProfilePicture from "components/ProfilePicture";
import { useState } from "react";
import { View, TextInput, StyleSheet, Button, Alert } from "react-native";
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import { UserRecord } from "types";

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
            <TextInput value={name} onChangeText={setName} style={styles.textField} />
            <ProfilePicture user={currentUser} style={styles.profilePicture} />
            <TextInput value={username} onChangeText={setUsername} style={styles.textField} />
            <TextInput value={email} onChangeText={setEmail} style={styles.textField} />
            <Button title="Save changes" onPress={updateUser} disabled={!hasChanged} />
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textField: {
        color: Colors.primary,
    },
    profilePicture: {
        width: 150,
        height: 150,
    },
});