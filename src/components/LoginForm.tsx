import AsyncStorage from "@react-native-async-storage/async-storage";
import LabelledTextInput from "components/LabelledTextInput";
import { pb } from "src/pocketbaseService";
import { useState } from "react";
import { View, Button, TouchableOpacity, Text, ImageSourcePropType, Image, ScrollView } from "react-native";
import Colors from "constants/colors";
import SignupForm from "./SignupForm";
import { UserRecord } from "types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VAR_PASSWORD, VAR_USERNAME, login, signup } from "src/authentification";
import { Alert } from "react-native";
import InputField from './InputField';
import CustomButton from "./CustomButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LoginParamList } from "./LoginNavigator";

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
        <View style={styles.lcontainer}>
            <ScrollView style={{width:"90%"}} >
                <Image source={require("assets/images/behealthy-icon.png")} style={{width:250, height:250, alignSelf:'center'}}/>
                <Text style={{color: Colors.accent, fontSize: 30, margin: 15, marginBottom: 20}}>Login</Text>
                <View>

                    {/*<LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} />*/}
                    <InputField
                        label={'Email or Username'}
                        icon={
                            <MaterialIcons
                            name="alternate-email"
                            size={20}
                            color="#666"
                            style={{marginRight: 5}}
                            />
                        }
                        keyboardType="email-address"
                        textFunction={(text: string) => setUsername(text)}
                    />
                    
                    {/* <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} secureTextEntry /> */}
                    <InputField
                        label={'Password'}
                        icon={
                            <Ionicons
                            name="ios-lock-closed-outline"
                            size={20}
                            color="#666"
                            style={{marginRight: 5}}
                        />
                        }
                        inputType="password"
                        textFunction={(text: string) => setPassword(text)}
                    />
                </View>
                <CustomButton label={"Login"} onPress={handleLogin} />     
                <BlurModal visible={showPasswordResetModal} onClose={() => setShowPasswordResetModal(false)}>
                    <View style={styles.container}>
                        <LabelledTextInput label="Email:" placeholder="Your email address" onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} style={{ textAlign: "center" }} />
                        <Button title="Reset password" onPress={handleForgotPassword} color={Colors.accent} />
                    </View>
                </BlurModal>           
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                    <Text>New to the app?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignupForm')}>
                        <Text style={{color: '#FFF4EC', fontWeight: '700'}}> Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
    

    // return (
    //     <View style={styles.container}>
    //         <Text style={styles.textfieldText}>Not signed in.</Text>
    //         <View>
    //             <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} />
    //             <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} secureTextEntry />
    //         </View>
    //         <Button title="Log in" onPress={handleLogin} color={Colors.accent}></Button>
    //         <Button title="Forgot password?" onPress={() => setShowPasswordResetModal(true)} color={Colors.accent}></Button>
    //         <Button title="Create an account" onPress={handleSignup} color={Colors.accent}></Button>
    //         <BlurModal visible={showPasswordResetModal} onClose={() => setShowPasswordResetModal(false)}>
    //             <View style={styles.container}>
    //                 <LabelledTextInput label="Email:" placeholder="Your email address" onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} style={{ textAlign: "center" }} />
    //                 <Button title="Reset password" onPress={handleForgotPassword} color={Colors.accent} />
    //             </View>
    //         </BlurModal>
    //     </View>
    // )
}