import { styles } from "../styles";
import LabelledTextInput from "components/LabelledTextInput";
import { ClientResponseError, RecordAuthResponse } from "pocketbase";
import { pb } from "src/pocketbaseService";
import { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import Colors from "constants/colors";

export default function LoginForm() {
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
            .then((response: RecordAuthResponse) => { console.log(response) })
            .catch((error: ClientResponseError) => {
                Alert.alert("Wrong username or password. Please try again.")
                console.log(error)
            })
    }

    async function devLogin(): Promise<void> {
        await pb.collection("users").authWithPassword("momolino", "Test123456")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textfieldText}>Not signed in.</Text>
            <View>
                <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} />
                <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} secureTextEntry />
            </View>
            <Button title="Sign Up" onPress={signup} color={Colors.accent}></Button>
            <Button title="Log in" onPress={login} color={Colors.accent}></Button>
            <Button title="Dev Login Cheat Code" onPress={devLogin} color={Colors.accent}></Button>
        </View>
    )
}