import Colors from "constants/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ForgotPasswordLabelProps = {
    textLabel: string;
    buttonLabel: string;
    onPress: () => void;
};

export default function ForgotPasswordLabel({ textLabel, buttonLabel, onPress }: ForgotPasswordLabelProps) {
    return <View style={styles.container}>
        <Text style={styles.text}>{textLabel}</Text>
        <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.3 }}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    text: {
        color: Colors.accent,
        marginRight: 5,
    },
    buttonText: {
        color: '#FFF4EC',
        fontWeight: '700'
    }
})