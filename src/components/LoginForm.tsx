import LabelledTextInput from "components/LabelledTextInput";
import { ClientResponseError, RecordAuthResponse } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import ProfilePicture from "components/ProfilePicture";
import Colors from "constants/colors";

export default function LoginForm(){
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

    return (
        <View style={styles.container}>
            <Text style={styles.signedInText}>Not signed in.</Text>
            <View style={styles.loginBox}>
                <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} />
                <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} secureTextEntry />
            </View>
            <Button title="Sign Up" onPress={signup} color={Colors.accent}></Button>
            <Button title="Log in" onPress={login} color={Colors.accent}></Button>
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
    loginBox: {
        margin: 5,
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