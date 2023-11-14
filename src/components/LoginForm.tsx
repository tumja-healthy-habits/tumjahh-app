import AsyncStorage from "@react-native-async-storage/async-storage";
import LabelledTextInput from "components/LabelledTextInput";
import Colors from "constants/colors";
import { useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { VAR_PASSWORD, VAR_USERNAME, login, signup } from "src/authentification";
import { pb } from "src/pocketbaseService";
import { UserRecord } from "types";
import { styles } from "../styles";
import BlurModal from "./BlurModal";

export default function LoginForm() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPasswordResetModal, setShowPasswordResetModal] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")

    async function handleSignup(): Promise<void> {
        try {
            const newRecord: UserRecord = await signup(username, password)
        }
        catch (error) {
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

    async function handleForgotPassword(): Promise<void> {
        pb.collection("users").requestPasswordReset(email).then((isFulfilled: boolean) => {
            console.log("password reset response: ", isFulfilled)
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textfieldText}>Not signed in.</Text>
            <View>
                <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} />
                <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} secureTextEntry />
            </View>
            <Button title="Log in" onPress={handleLogin} color={Colors.accent}></Button>
            <Button title="Forgot password?" onPress={() => setShowPasswordResetModal(true)} color={Colors.accent}></Button>
            <Button title="Create an account" onPress={handleSignup} color={Colors.accent}></Button>
            <BlurModal visible={showPasswordResetModal} onClose={() => setShowPasswordResetModal(false)}>
                <View style={styles.container}>
                    <LabelledTextInput label="Email:" placeholder="Your email address" onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} style={{ textAlign: "center" }} />
                    <Button title="Reset password" onPress={handleForgotPassword} color={Colors.accent} />
                </View>
            </BlurModal>
        </View>
    )
}