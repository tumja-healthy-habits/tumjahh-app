import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { signup } from "src/authentification";

import CustomButton from './CustomButton';
import { FormTextInput } from './InputField';
import { LoginParamList } from "./LoginNavigator";


import { globalStyles } from 'src/styles';
import ForgotPasswordLabel from "./ForgotPasswordLabel";

export default function SignupForm() {

	const [username, setUsername] = useState<string>("")
	const [name, setName] = useState<string>("")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [passwordConfirm, setPasswordConfirm] = useState<string>("")

	const [date, setDate] = useState(new Date());
	const [open, setOpen] = useState(false);
	const [dobLabel, setDobLabel] = useState('Date of Birth');

	//const navigation = useNavigation<NavigationProp<LoginParamList, "SignupForm">>()

	const { goBack } = useNavigation<NavigationProp<LoginParamList, "SignupForm">>()



	function handleSignup(): void {
		try {
			signup(username, name ? name : username, email, password, passwordConfirm)
		}
		catch (error: any) {
			console.log(error.message)
			if (error.message == "validation_invalid_username") {
				Alert.alert("Username already exists.\n Please choose a different username")
			}
			else if (error.message == "validation_required") {
				Alert.alert("Confirm Password and Password must be the same")
			}
			else if (error.message == "validation_invalid_email") {
				Alert.alert("E-Mail already registered.\n Please use a different E-Mail")
			}
		}
	}


	return (
		<View style={[globalStyles.container, styles.outerContainer]}>
			<View style={{ width: "90%" }}>
				<View style={styles.headerContainer}>
					<Text style={styles.formTitle}>Register</Text>
					<Image source={require("assets/images/behealthy-icon.png")} style={{ width: 170, height: 170, alignSelf: 'flex-end' }} />
				</View>

				<FormTextInput
					label={'Username'}
					iconName="person-outline"
					onChangeText={setUsername}
				/>

				<FormTextInput
					label={'Name'}
					iconName="person-outline"
					onChangeText={setName}
				/>

				<FormTextInput
					label={'Email'}
					iconName="at-outline"
					keyboardType="email-address"
					onChangeText={setEmail}
				/>

				<FormTextInput
					label={'Password'}
					iconName="ios-lock-closed-outline"
					inputType="password"
					onChangeText={setPassword}
				/>

				<FormTextInput
					label={'Confirm Password'}
					iconName="ios-lock-closed-outline"
					inputType="password"
					onChangeText={setPasswordConfirm}
				/>

				{/* <TextInputMask
            refInput={setDate}
            type={'datetime'}
            options={{
                format: 'DD-MM-YYYY HH:mm:ss'
            }}
        /> */}


				<CustomButton label={'Register'} onPress={handleSignup} />
				<ForgotPasswordLabel
					textLabel="Already registered?"
					buttonLabel="Login"
					onPress={goBack}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	outerContainer: {
		backgroundColor: '#d7c3de',
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 15,
	},
	formTitle: {
		color: Colors.accent,
		fontSize: 30,
		margin: 15,
		marginBottom: 20,
		alignSelf: "flex-end",
	},
	alreadyRegisteredContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 30,
	},
})