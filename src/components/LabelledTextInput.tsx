import Colors from "constants/colors"
import { StyleSheet, Text, TextInput, TextInputProps } from "react-native"
import { View } from "react-native"

type LabelledTextInputProps = TextInputProps & {
    label: string,
}

export default function LabelledTextInput(props: LabelledTextInputProps) {
    const { label, ...inputProps } = props
    return <View style={styles.hcontainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput {...inputProps} style={styles.textInput} autoComplete="off" autoCapitalize="none" />
    </View>
}

const styles = StyleSheet.create({
    hcontainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    label: {
        paddingRight: 15,
        color: Colors.accent,
    },
    textInput: {
        borderColor: Colors.accent,
        borderWidth: 1,
        minWidth: 50,
        borderRadius: 4,
        textAlign: "center",
        padding: 5,
        color: "white",
    },
})