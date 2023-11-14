import Colors from "constants/colors";
import { StyleSheet, Text, View } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";

export default function FeedScreen() {

    const { currentUser } = useAuthenticatedUser()

    if (currentUser === null) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>You need to be logged in to use this feature</Text>
            </View>
        )
    }

    return (
        <View />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.pastelViolet,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    }
});