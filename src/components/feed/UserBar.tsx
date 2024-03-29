import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import { UserRecord } from "types";


type UserBarProps = {
	user: UserRecord,
	style?: any
}

export default function UserBar({ user, style }: UserBarProps) {
	const profilePictureSource: ImageSourcePropType = user.avatar ? { uri: pb.getFileUrl(user, user.avatar) } : require("assets/images/default-avatar.png")
	//const colorScheme = Appearance.getColorScheme()

	return (
		<View style={[style, styles.outerContainer]}>
			<View style={styles.innerContainer}>
				<Image
					source={profilePictureSource}
					style={styles.image}
				/>
				<Text style={styles.text}>{user.username}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	outerContainer: {
		height: 60,
		justifyContent: 'center',
		paddingLeft:10
		// borderWidth: 1,
	},
	innerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginLeft: 5,
	},
	text: {
		fontSize: 20,
		marginLeft: 10,
	}
})