import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type LoginButtonProps = {
	label: string;
	onPress: () => void;
	color?: string;
	style?: any
};

export default function LoginButton({ label, onPress, color, style}: LoginButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [{backgroundColor: color ? color : '#FFF4EC'}, styles.container, pressed && { opacity: 0.3 }, style,]}>
			<Text style={styles.text}>
				{label}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
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