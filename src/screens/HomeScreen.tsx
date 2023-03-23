import LabelledTextInput from "components/LabelledTextInput";
import { RecordAuthResponse } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { useState } from "react";
import { View, Button, Text } from "react-native";
import { styles } from "src/styles";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";

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
        const response: RecordAuthResponse = await pb.collection("users").authWithPassword(username, password)
    }

    async function logout(): Promise<void> {
        await pb.authStore.clear()
    }

    return (
        <View style={styles.container}>
            <Text>{currentUser === null ? "Not signed in!" : "Signed in as " + currentUser.id}</Text>
            <View style={styles.loginBox}>
                <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} style={styles.textInput} />
                <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} style={styles.textInput} secureTextEntry />
            </View>
            <View>
                <Button title="Sign Up" onPress={signup}></Button>
                <Button title="Log in" onPress={login}></Button>
                <Button title="Log out" onPress={logout}></Button>
            </View>
        </View>
    )
}