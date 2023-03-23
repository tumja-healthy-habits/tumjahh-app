import LabelledTextInput from "components/LabelledTextInput";
import { ClientResponseError, RecordAuthResponse } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import ProfilePicture from "components/ProfilePicture";

export default function HomeScreen() {
    const { currentUser } = useAuthenticatedUser()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    async function signup(): Promise<void> {
        const data: {} = {
            username: username,
            password: password,
            passwordConfirm: password,
        }
        await pb.collection("users").create(data)
        await login()
    }

    async function login(): Promise<void> {
        pb.collection("users").authWithPassword(username, password)
            .then((response: RecordAuthResponse) => { })
            .catch((error: ClientResponseError) => Alert.alert("Wrong username or password. Please try again."))
    }

    async function logout(): Promise<void> {
        await pb.authStore.clear()
    }

    if (currentUser === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.signedInText}>Not signed in.</Text>
                <View style={styles.loginBox}>
                    <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} />
                    <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} secureTextEntry />
                </View>
                <Button title="Sign Up" onPress={signup}></Button>
                <Button title="Log in" onPress={login}></Button>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ProfilePicture user={currentUser} style={{ width: 150, height: 150 }} />
            <Text style={styles.signedInText}>Signed in as {currentUser.name}</Text>
            <Button title="Log out" onPress={logout}></Button>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBox: {
        margin: 5,
    },
    signedInText: {
        marginBottom: 50,
    }
});