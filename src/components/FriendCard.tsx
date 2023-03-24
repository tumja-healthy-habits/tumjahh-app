import Colors from "constants/colors";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { UserRecord } from "types";
import ProfilePicture from "./ProfilePicture";

type FriendCardProps = {
    user: UserRecord,
}

export default function FriendCard({ user }: FriendCardProps) {
    return (
        <View style={styles.outerContainer}>
            <Pressable>
                <View style={styles.innerContainer}>
                    <ProfilePicture user={user} style={styles.image} />
                    <Text style={styles.name}>{user.name}</Text>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 0.5,
        margin: 16,
        height: 150,
        borderRadius: 8,
    },
    innerContainer: {
        // borderWidth: 1,
        // borderColor: "#ccc",
        justifyContent: "space-between",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "85%",
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        color: Colors.accent,
    }
})