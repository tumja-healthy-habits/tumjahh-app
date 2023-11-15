import Colors from "constants/colors"
import { Text, TextInput, TextInputProps, View } from "react-native"

type LabelledTextInputProps = TextInputProps & {
    label: string,
}

export default function LabelledTextInput(props: LabelledTextInputProps) {
    const { label, ...inputProps } = props
    return <View style={styles.hcontainer}>
        <Text style={styles.textfieldText}>{label}</Text>
        <TextInput {...inputProps} style={styles.textInput} placeholderTextColor={Colors.primaryDark} autoComplete="off" autoCapitalize="none" />
    </View>
}