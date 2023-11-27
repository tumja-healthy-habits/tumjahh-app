import React, {forwardRef} from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

type InputFieldProps = {
	label: string;
	icon?: React.ReactNode;
	inputType?: string;
	keyboardType?: KeyboardTypeOptions;
	fieldButtonLabel?: string;
	fieldButtonFunction?: () => void;
	onChangeText?: (text: string) => void;
};

export default function InputField({
	label,
	icon,
	inputType,
	keyboardType,
	fieldButtonLabel,
	fieldButtonFunction,
	onChangeText
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
};

export function FormTextInput({ label, iconName, onChangeText, ...props }: FormTextInputProps) {
	return <InputField
		{...props}
		label={label}
		icon={<Ionicons name={iconName} size={20} color="#666" style={{ marginRight: 5 }} />}
		onChangeText={onChangeText}
	/>
};

type CalendarInputProps = {
	label: string;
	iconName: any;
	onChangeDate: (event:any, selectedDate:any) => void;
	mode: any;
	value: Date;
	onPress: () => void;
	openPicker: boolean;
}

export function CalendarInput({label, iconName, onChangeDate, mode, value, onPress, openPicker}: CalendarInputProps) {
	return <View style={[styles.container, {width:'45%'}]}>
		
		<Ionicons name={iconName} size={20} color="#666" style={{ marginRight: 5, alignSelf:"flex-end"}} />

		{!openPicker && 
		<Pressable onPress={onPress} style={{alignSelf:"flex-end"}}>
		 	<Text style={{color:"#a89bb0", fontSize:16}}>{label}</Text>
		</Pressable>}
		
		{openPicker && <DateTimePicker
			value={value}
			mode={mode}
			onChange={onChangeDate}
			style={{alignSelf:"flex-end", paddingBottom:0, marginBottom:0}}
		/>}
	</View>

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
		fontSize:16
	},
	phoneNumberContainer: {
		backgroundColor: 'transparent'
	}
}) 