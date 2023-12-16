import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type LoginButtonProps = {
	label: string;
	onPress: () => void;
	spacing?: any
};

export default function LoginButton({ label, onPress, spacing }: LoginButtonProps) {
	return (
		<View style={spacing}>
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [styles.container, pressed && { opacity: 0.3 }]}>
				<Text style={styles.text}>
					{label}
				</Text>
			</Pressable>
		</View>
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