import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import React, { useState, useRef } from 'react';
import { Alert, Image, StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import {ScrollView} from 'react-native-gesture-handler'
import DropDownPicker from 'react-native-dropdown-picker';
import PhoneInput from "react-native-phone-number-input";
import { Ionicons } from '@expo/vector-icons';
import {Dropdown} from 'react-native-element-dropdown';


import { signup } from "src/authentification";

import LoginButton from './LoginButton';
import { CalendarInput, FormTextInput} from './InputField';
import { LoginParamList } from "./LoginNavigator";


import { globalStyles } from 'src/styles';
import ForgotPasswordLabel from "./ForgotPasswordLabel";

export default function SignupForm() {

	const [username, setUsername] = useState<string>("")
	const [name, setName] = useState<string>("")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [passwordConfirm, setPasswordConfirm] = useState<string>("")
	const [gender, setGender] = useState<string>("");
	const genderOptions = [
		{label: 'Male', value: 'male'},
		{label: 'Female', value: 'female'},
		{label: 'Diverse', value: 'diverse'},
		{label: 'Not specified', value: 'not specified'}
	];
	const [phoneNumber, setPhoneNumber] = useState("");
  	const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
	const phoneInput = useRef<PhoneInput>(null);
	const [age, setAge] = useState(0);
	const [birthdate, setBirthdate] = useState(new Date())
	const [openDatepicker, setOpenDatepicker] = useState(false)
	console.log(birthdate)


	const { goBack } = useNavigation<NavigationProp<LoginParamList, "SignupForm">>()


	function handleSignup(): void {
		try {
			signup(username, name ? name : username, email, password, passwordConfirm, formattedPhoneNumber, gender, birthdate)
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

	const onChangeDate = (event:any, selectedDate:any) => {
		const currentDate = selectedDate;
		setBirthdate(currentDate);
	};


	return (
		<ScrollView contentContainerStyle={[globalStyles.container, styles.outerContainer]}>
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

				<View style={styles.inputFieldContainer}>
					<Ionicons name={'ios-call-outline'} size={20} color="#666" style={{ marginRight: 5,}} />
					<PhoneInput
						ref={phoneInput}
						defaultValue={phoneNumber}
						defaultCode="DE"
						layout="second"
						onChangeText={(text) => {
						setPhoneNumber(text);
						}}
						onChangeFormattedText={(text) => {
						setFormattedPhoneNumber(text);
						}}
						containerStyle={styles.phoneNumberContainer}
						textContainerStyle={styles.phoneNumberContainer}
						textInputStyle={styles.inputText}
					/>
				</View>

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

				<View style={{flexDirection:'row', justifyContent: 'space-between',}}>
					<CalendarInput 
						label="Birthdate"
						iconName="calendar-outline"
						onChangeDate={onChangeDate}
						mode={"date"}
						onPress={() => setOpenDatepicker(true)}
						value={birthdate}
						openPicker={openDatepicker}
					/>
					<Dropdown
						style={styles.dropdown}
						placeholderStyle={styles.inputText}
						//selectedTextStyle={styles.selectedTextStyle}
						//inputSearchStyle={styles.inputSearchStyle}
						//iconStyle={styles.iconStyle}
						data={genderOptions}
						//search
						maxHeight={300}
						labelField="label"
						valueField="value"
						placeholder={'Gender'}
						value={gender}
						//onFocus={() => setIsFocus(true)}
						//onBlur={() => setIsFocus(false)}
						onChange={(item) => {
							setGender(item.value);
							//setIsFocus(false);
						}}
					/>
				</View>
			
				<LoginButton label={'Register'} onPress={handleSignup} />
				<ForgotPasswordLabel
					textLabel="Already registered?"
					buttonLabel="Login"
					onPress={goBack}
				/>

				<Text style={{marginBottom:25}}/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	outerContainer: {
		backgroundColor: '#d7c3de',
		minHeight:'100%',
		paddingTop:'15%',
		flexGrow: 1
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
	inputFieldContainer: {
		flexDirection: 'row',
		borderBottomColor: '#FFF4EC',
		borderBottomWidth: 1,
		marginBottom: 25,
		backgroundColor: 'transparent',
		width: '100%',
	},
	inputText: {
		fontSize: 16,
	},
	phoneNumberContainer: {
		backgroundColor: 'transparent',
		alignSelf: 'flex-start',
		paddingTop:0,
		paddingLeft:0
	},
	dropdown: {
		width:'45%',
		borderColor:'#FFF4EC',
		borderRadius:8,
		borderWidth: 1,
		paddingHorizontal: 8,
		marginBottom:25
	}
})