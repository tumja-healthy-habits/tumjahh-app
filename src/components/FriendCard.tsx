import { Pressable, View, Text, StyleSheet, Image } from "react-native";

type FriendCardProps = {
    name: string,
    avatarUrl: string,
}

export default function FriendCard({ name, avatarUrl }: FriendCardProps) {
    const imageSource = avatarUrl ? { uri: avatarUrl } : require("assets/images/default-avatar.jpeg")
    return (
        <View style={styles.outerContainer}>
            <Pressable>
                <View style={styles.innerContainer}>
                    <Image source={imageSource} style={styles.image} />
                    <Text style={styles.name}>{name}</Text>
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
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "space-between",
    },
    image: {
        width: "100%",
        height: "85%",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center"
    }
})