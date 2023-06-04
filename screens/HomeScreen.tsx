import { pb } from "src/pocketbaseService";
import { styles, imageStyles } from "../styles";
import { View, Button, Text } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import ProfilePicture from "components/ProfilePicture";
import Colors from "constants/colors";
import LoginForm from "components/LoginForm";

export default function HomeScreen() {
    const { currentUser } = useAuthenticatedUser()

    async function logout(): Promise<void> {
        await pb.authStore.clear()
    }

    if (currentUser === null) {
        return (
            <LoginForm />
        )
    }

    // user is logged in
    return (
        <View style={styles.container}>
            <ProfilePicture user={currentUser} style={imageStyles.profilePicture} />
            <Text style={styles.textfieldText}>Signed in as {currentUser.name}</Text>
            <Button title="Log out" onPress={logout} color={Colors.accent}></Button>
        </View>
    )
}