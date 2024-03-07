import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { login } from "src/authentification";
import { pb } from "src/pocketbaseService";
import { globalStyles } from "../../styles";
import BlurModal from "../misc/BlurModal";
import ForgotPasswordLabel from "./ForgotPasswordLabel";
import { FormTextInput } from './InputField';
import LoginButton from "./LoginButton";
import { LoginParamList } from "./LoginNavigator";

export default function LoginForm() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPasswordResetModal, setShowPasswordResetModal] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")

    const navigation = useNavigation<NavigationProp<LoginParamList, "LoginForm">>()


    async function handleLogin(): Promise<void> {
        login(username, password)
            .catch((error) => {
                console.log(error.message)
                if (error.message === "Failed to authenticate.") {
                    Alert.alert("Wrong username or password. \n Please try again")
                }
                else {
                    Alert.alert("Something went wrong while trying to log in.\n Please try again")
                }
            })
    }

    async function handleForgotPassword(): Promise<void> {
        pb.collection("users").requestPasswordReset(email).then((isFulfilled: boolean) => {
            console.log("password reset response: ", isFulfilled)
        })
    }

    return (
        //<ScrollView contentContainerStyle={[globalStyles.container, styles.outerContainer]}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={[globalStyles.container, styles.outerContainer]}>
            <View style={styles.innerContainer} >
                <Image source={require("assets/images/behealthy-icon.png")} style={{ width: 250, height: 250, alignSelf: 'center' }} />
                <Text style={styles.formTitle}>Login</Text>


                <FormTextInput
                    label={'Email or Username'}
                    iconName="at-outline"
                    keyboardType="email-address"
                    onChangeText={setUsername}
                    mandatory={false}
                />

                <FormTextInput
                    label={'Password'}
                    iconName="ios-lock-closed-outline"
                    inputType="password"
                    onChangeText={setPassword}
                    fieldButtonLabel={"Forgot?"}
                    fieldButtonFunction={() => setShowPasswordResetModal(true)}
                    mandatory={false}
                />


                <LoginButton label="Login" onPress={handleLogin} />

                <BlurModal visible={showPasswordResetModal} onClose={() => setShowPasswordResetModal(false)}>
                    <View style={styles.modalContainer} >
                        <Text style={styles.modalText}>Please enter your e-mail address to reset your password</Text>
                        <FormTextInput
                            label={'Email'}
                            iconName="at-outline"
                            keyboardType="email-address"
                            onChangeText={setUsername}
                            mandatory={false}
                        />
                        <LoginButton label="Reset password" onPress={handleForgotPassword} />
                    </View>
                </BlurModal>

                <ForgotPasswordLabel
                    textLabel="New to the app?"
                    buttonLabel="Register"
                    onPress={() => navigation.navigate('SignupForm')}
                />

                {/* <Text style={{marginTop:50, marginBottom:50}}></Text> */}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#d7c3de',
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        width: "90%",
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