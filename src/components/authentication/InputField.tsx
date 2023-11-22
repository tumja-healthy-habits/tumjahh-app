import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderBottomColor: '#FFF4EC',
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginBottom: 25,
	},
	textfieldText: {
		color: '#FFF4EC',
		fontSize: 16,
		// marginBottom: 10,
	},
	textfieldButton: {
		color: '#FFF4EC',
		fontWeight: "700"
	},
	textfield: {
		flex: 1,
		paddingVertical: 0,
	},
})