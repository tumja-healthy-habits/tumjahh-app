import Colors from "constants/colors";
import { StyleSheet, Text, View } from "react-native";

export default function FeedScreen() {
    return (
        <View style={styles.container}>
            <Text style={{ color: Colors.accent, fontSize: 40 }}>Your Feed</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    }
})