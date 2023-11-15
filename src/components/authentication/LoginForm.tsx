import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { VAR_PASSWORD, VAR_USERNAME, login } from "src/authentification";
import { pb } from "src/pocketbaseService";
import { UserRecord } from "types";
import { globalStyles } from "../../styles";
import BlurModal from "../misc/BlurModal";
import CustomButton from "./CustomButton";
import ForgotPasswordLabel from "./ForgotPasswordLabel";
import { FormTextInput } from './InputField';
import { LoginParamList } from "./LoginNavigator";

export default function LoginForm() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPasswordResetModal, setShowPasswordResetModal] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")

    const navigation = useNavigation<NavigationProp<LoginParamList, "LoginForm">>()


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
        <View style={[globalStyles.container, styles.outerContainer]}>
            <View style={{ width: "90%" }} >
                <Image source={require("assets/images/behealthy-icon.png")} style={{ width: 250, height: 250, alignSelf: 'center' }} />
                <Text style={styles.formTitle}>Login</Text>
                <View>

                    <FormTextInput
                        label={'Email or Username'}
                        iconName="at-outline"
                        keyboardType="email-address"
                        onChangeText={setUsername}
                    />

                    <FormTextInput
                        label={'Password'}
                        iconName="ios-lock-closed-outline"
                        inputType="password"
                        onChangeText={setPassword}
                        fieldButtonLabel={"Forgot?"}
                        fieldButtonFunction={() => setShowPasswordResetModal(true)}
                    />
                </View>
                <CustomButton label="Login" onPress={handleLogin} />

                <BlurModal visible={showPasswordResetModal} onClose={() => setShowPasswordResetModal(false)}>
                    <View style={styles.modalContainer} >
                        <Text style={styles.modalText}>Please enter your e-mail address to reset your password</Text>
                        <FormTextInput
                            label={'Email'}
                            iconName="at-outline"
                            keyboardType="email-address"
                            onChangeText={setUsername}
                        />
                        <CustomButton label="Reset password" onPress={handleForgotPassword} />
                    </View>
                </BlurModal>

                <ForgotPasswordLabel
                    textLabel="New to the app?"
                    buttonLabel="Register"
                    onPress={() => navigation.navigate('SignupForm')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#d7c3de',
    },
    formTitle: {
        color: Colors.accent,
        fontSize: 30,
        margin: 15,
        marginBottom: 20,
    },
    modalContainer: {
        backgroundColor: '#d7c3de',
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    }
})