import { styles } from "../styles";
import LabelledTextInput from "components/LabelledTextInput";
import { pb } from "src/pocketbaseService";
import { useState } from "react";
import { View, Button, Text } from "react-native";
import Colors from "constants/colors";
import { UserRecord } from "types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VAR_PASSWORD, VAR_USERNAME, login, signup } from "src/authentification";
import { Alert } from "react-native";

export default function LoginForm() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    async function handleSignup(): Promise<void> {
        try {
            const newRecord: UserRecord = await signup(username, password)
        }
        catch(error) {
            console.log(error.message)
            if (error.message == "validation_invalid_username") {
                Alert.alert("Username already exists.\n Please select a different username")
            }
        }
    }

    async function handleLogin(): Promise<void> {
        login(username, password)
            .then((record: UserRecord) => {
                // store the login data to local storage if the login attempt was successful
                AsyncStorage.setItem(VAR_USERNAME, username)
                AsyncStorage.setItem(VAR_PASSWORD, password)
            })
            .catch(() => Alert.alert("Something went wrong while trying to log in.\n Please try again"))
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textfieldText}>Not signed in.</Text>
            <View>
                <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} />
                <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} secureTextEntry />
            </View>
            <Button title="Sign Up" onPress={handleSignup} color={Colors.accent}></Button>
            <Button title="Log in" onPress={handleLogin} color={Colors.accent}></Button>
        </View>
    )
}