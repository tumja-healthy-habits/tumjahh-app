import LabelledTextInput from "components/LabelledTextInput";
import { ClientResponseError, RecordAuthResponse } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import ProfilePicture from "components/ProfilePicture";
import Colors from "constants/colors";
import LoginForm from "components/LoginForm";

export default function HomeScreen() {
    const { currentUser } = useAuthenticatedUser()

    async function logout(): Promise<void> {
        await pb.authStore.clear()
    }

    if (currentUser === null) {
        return (
            <LoginForm />
        )
    }

    // user is logged in
    return (
        <View style={styles.container}>
            <ProfilePicture user={currentUser} style={styles.profilePicture} />
            <Text style={styles.signedInText}>Signed in as {currentUser.name}</Text>
            <Button title="Log out" onPress={logout} color={Colors.accent}></Button>
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
    signedInText: {
        marginBottom: 50,
        color: Colors.accent,
    },
    profilePicture: {
        width: 150,
        height: 150,
    }
});