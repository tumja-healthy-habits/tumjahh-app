import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ImagePickerResult, MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import React from 'react';
import { Image, KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FixedDimensionImage } from 'types';
import IconButton from "../misc/IconButton";

type StarIconProps = {
	iconName: any;
	style?: any;
}

const StarIcon = ({ iconName, style = {} }: StarIconProps) => {
	return (
		<View style={[{ flexDirection: 'row', marginRight: 10 }, style]}>
			{<Ionicons name={iconName} size={20} color="#666" />}
			<Text style={{ position: 'absolute', top: -5, right: -5, fontSize: 16, }}>*</Text>
		</View>
	);
};
export { StarIcon };


type InputFieldProps = {
	label: string;
	icon?: React.ReactNode;
	inputType?: string;
	keyboardType?: KeyboardTypeOptions;
	fieldButtonLabel?: string;
	fieldButtonFunction?: () => void;
	onChangeText?: (text: string) => void;
	value?: string;
};

export default function InputField({
	label,
	icon,
	inputType,
	keyboardType,
	fieldButtonLabel,
	fieldButtonFunction,
	onChangeText,
	value
}: InputFieldProps) {
	return (
		<View style={styles.container}>
			{icon}
			<TextInput
				placeholder={label}
				keyboardType={keyboardType}
				style={styles.textfield}
				secureTextEntry={inputType === 'password'}
				onChangeText={onChangeText}
				autoCapitalize='none'
				autoCorrect={false}
				value={value}
			/>
			{fieldButtonLabel && <TouchableOpacity onPress={fieldButtonFunction}>
				<Text style={styles.textfieldButton}>{fieldButtonLabel}</Text>
			</TouchableOpacity>}
		</View>
	);
}

type FormTextInputProps = InputFieldProps & {
	label: string;
	iconName: any;
	onChangeText: (text: string) => void;
	mandatory: boolean;
};

export function FormTextInput({ label, iconName, onChangeText, mandatory, ...props }: FormTextInputProps) {
	return <InputField
		{...props}
		label={label}
		icon={mandatory ? <StarIcon iconName={iconName} /> : <Ionicons name={iconName} size={20} color="#666" style={{ marginRight: 5 }} />}
		onChangeText={onChangeText}
	/>
};

type CalendarInputProps = {
	label: string;
	iconName: any;
	onChangeDate: (event: any, selectedDate: any) => void;
	mode: any;
	value: Date;
	onPress: () => void;
	openPicker: boolean;
}

export function CalendarInput({ label, iconName, onChangeDate, mode, value, onPress, openPicker }: CalendarInputProps) {
	return <View style={[styles.container, { width: '45%' }]}>

		{/* <Ionicons name={iconName} size={20} color="#666" style={{ marginRight: 5, alignSelf:"flex-end"}} /> */}
		<StarIcon iconName={iconName} style={{ alignSelf: 'flex-end' }} />

		{!openPicker &&
			<Pressable onPress={onPress} style={{ alignSelf: "flex-end" }}>
				<Text style={{ color: "#a89bb0", fontSize: 16 }}>{label}</Text>
			</Pressable>}

		{openPicker && <DateTimePicker
			value={value}
			mode={mode}
			onChange={onChangeDate}
			style={{ alignSelf: "flex-end", paddingBottom: 0, marginBottom: 0 }}
		/>}
	</View>

}

type ProfilePictureInputProps = {
	onTakePhoto: (photo: FixedDimensionImage) => void,
	profilePicture?: FixedDimensionImage
}

export function ProfilePictureInput({ onTakePhoto, profilePicture }: ProfilePictureInputProps) {

	async function openMediaLibrary(): Promise<void> {
		launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
			allowsMultipleSelection: false,
			aspect: [1, 1] //for android, on ios the crop rectangle is always a square
		}).then((result: ImagePickerResult) => {
			if (result.canceled) return
			onTakePhoto(result.assets[0])
		})
	}

	return (
		<View style={styles.profilePictureContainer}>
			<Text style={{ fontSize: 16 }}>Profile Picture</Text>
			<View style={styles.profilePictureContainer}>
				<Image
					source={profilePicture ? { uri: profilePicture!.uri } : require("assets/images/default-avatar.png")}
					style={{ width: 100, height: 100, opacity: 0.8, borderRadius: 8 }}
				/>
				<View style={styles.overlay}>
					<IconButton icon="image-outline" color="white" onPress={openMediaLibrary} size={40} />
				</View>
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderBottomColor: '#FFF4EC',
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginBottom: 25,
		backgroundColor: 'transparent'
	},
	textfieldText: {
		color: '#FFF4EC',
		fontSize: 12,
		// marginBottom: 10,
	},
	textfieldButton: {
		color: '#FFF4EC',
		fontWeight: "700",
	},
	textfield: {
		flex: 1,
		paddingVertical: 0,
		fontSize: 16
	},
	phoneNumberContainer: {
		backgroundColor: 'transparent'
	},
	profilePictureContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
}) 