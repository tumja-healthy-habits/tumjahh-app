import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type LoginButtonProps = {
	label: string;
	onPress: () => void;
	color?: string;
	style?: any;
	spacing?: any
};

export default function LoginButton({ label, onPress, color, style, spacing }: LoginButtonProps) {
	return (
		<View style={spacing}>
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [{ backgroundColor: color ? color : '#FFF4EC' }, styles.container, pressed && { opacity: 0.3 }, style,]}>
				<Text style={styles.text}>
					{label}
				</Text>
			</Pressable>
		</View>
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