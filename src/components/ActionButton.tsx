import Colors from "constants/colors";
import { Text, ButtonProps, Pressable, StyleSheet } from "react-native";

export default function ActionButton({ onPress, title, color }: ButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [styles.container, {
                backgroundColor: pressed ? Colors.pastelViolet : (color || "black"),
            }]}
            onPress={onPress}
        >
            {({ pressed }) => <Text style={[styles.buttonText, { color: pressed ? "black" : Colors.white }]}>{title}</Text>}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 25,
        marginVertical: 13,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 20,
    }
})