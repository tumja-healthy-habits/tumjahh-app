import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import React, { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import PhoneInput from "react-native-phone-number-input";


import { signup } from "src/authentification";

import { FixedDimensionImage } from "types";
import { CalendarInput, FormTextInput, ProfilePictureInput } from './InputField';
import LoginButton from './LoginButton';
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
		{ label: 'Male', value: 'male' },
		{ label: 'Female', value: 'female' },
		{ label: 'Diverse', value: 'diverse' },
		{ label: 'Not specified', value: 'not specified' }
	];
	const [phoneNumber, setPhoneNumber] = useState("");
	const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
	const phoneInput = useRef<PhoneInput>(null);
	const [birthdate, setBirthdate] = useState(new Date())
	const [openDatepicker, setOpenDatepicker] = useState(false)
	const [isStudent, setIsStudent] = useState("")
	const [profilePicture, setProfilePicture] = useState<FixedDimensionImage>()


	const { goBack } = useNavigation<NavigationProp<LoginParamList, "SignupForm">>()


	function handleSignup(): void {
		signup(username,
			name ? name : username,
			email,
			password,
			passwordConfirm,
			formattedPhoneNumber,
			gender, birthdate,
			isStudent === 'yes' ? true : false,
			profilePicture !== undefined ? {
				uri: profilePicture!.uri,
				name: profilePicture!.uri,
				type: "image/jpg"
			} : {})
	}

	const onChangeDate = (event: any, selectedDate: any) => {
		const currentDate = selectedDate;
		setBirthdate(currentDate);
	};


	return (
		//<ScrollView contentContainerStyle={[globalStyles.container, styles.outerContainer]}>
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			style={[globalStyles.container, styles.outerContainer]}>
			<View style={styles.innerContainer}>
				<View style={styles.headerContainer}>
					<Text style={styles.formTitle}>Register</Text>
					<Image source={require("assets/images/behealthy-icon.png")} style={{ width: 170, height: 170, alignSelf: 'flex-end' }} />
				</View>

				<ScrollView>
					<FormTextInput
						label={'Username'}
						iconName="person-outline"
						onChangeText={setUsername}
						mandatory={true}
					/>

					<FormTextInput
						label={'Name'}
						iconName="person-outline"
						onChangeText={setName}
						mandatory={false}
					/>

					<FormTextInput
						label={'Email'}
						iconName="at-outline"
						keyboardType="email-address"
						onChangeText={setEmail}
						mandatory={true}
					/>

					<View style={styles.inputFieldContainer}>
						<Ionicons name={'ios-call-outline'} size={20} color="#666" style={{ marginRight: 5, }} />
						{/* <StarIcon iconName={'ios-call-outline'} /> */}
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
						mandatory={true}
					/>

					<FormTextInput
						label={'Confirm Password'}
						iconName="ios-lock-closed-outline"
						inputType="password"
						onChangeText={setPasswordConfirm}
						mandatory={true}
					/>

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
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
							placeholder={'Gender *'}
							value={gender}
							//onFocus={() => setIsFocus(true)}
							//onBlur={() => setIsFocus(false)}
							onChange={(item) => {
								setGender(item.value);
								//setIsFocus(false);
							}}
						/>
					</View>

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
						<View style={{ width: '50%' }}>
							<Text style={{ fontSize: 16 }}>Are you a student? *</Text>
							<View style={{ width: '50%' }}>
								<RadioButton.Group
									onValueChange={(value) => setIsStudent(value)}
									value={isStudent}
								>
									<RadioButton.Item label="Yes" value="yes"
										style={styles.radioButton}
										labelStyle={styles.radioButtonLabel}
										color="#FFF4EC" />
									<RadioButton.Item label="No" value="no"
										style={styles.radioButton}
										labelStyle={styles.radioButtonLabel}
										color="#FFF4EC" />
								</RadioButton.Group>
							</View>
						</View>
						<View style={{ width: "50%" }}>
							<ProfilePictureInput onTakePhoto={setProfilePicture} profilePicture={profilePicture} />
						</View>
					</View>

					<LoginButton label={'Register'} onPress={handleSignup} />
					<ForgotPasswordLabel
						textLabel="Already registered?"
						buttonLabel="Login"
						onPress={goBack}
					/>
				</ScrollView>

			</View>
		</KeyboardAvoidingView>
		// </ScrollView>
	);
};

const styles = StyleSheet.create({
	outerContainer: {
		backgroundColor: '#d7c3de',
		// minHeight:'100%',
		//paddingTop:'40%',
		flexGrow: 1,
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		width: "90%",
		marginTop: "15%",
		paddingBottom: "15%"
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
		paddingTop: 0,
		paddingLeft: 0
	},
	dropdown: {
		width: '45%',
		borderColor: '#FFF4EC',
		borderRadius: 8,
		borderWidth: 1,
		paddingHorizontal: 8,
		marginBottom: 25
	},
	radioButton: {
		borderWidth: 1,
		borderColor: '#FFF4EC',
		borderRadius: 8,
		margin: 5,
		paddingVertical: 0,
		paddingLeft: 7,
		paddingRight: 0,
	},
	radioButtonLabel: {
		paddingHorizontal: 0
	},
})