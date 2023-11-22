import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type CustomButtonProps = {
	label: string;
	onPress: () => void;
};

export default function CustomButton({ label, onPress }: CustomButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.container, pressed && { opacity: 0.3 }]}>
			<Text style={styles.text}>
				{label}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF4EC',
		padding: 20,
		borderRadius: 10,
		width: '90%',
		alignSelf: 'center'
	},
	text: {
		textAlign: 'center',
		fontWeight: '700',
		fontSize: 16,
		color: '#000',
	}
})