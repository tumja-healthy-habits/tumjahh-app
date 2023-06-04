import Colors from "constants/colors"
import { styles } from "../styles"
import { Text, TextInput, TextInputProps } from "react-native"
import { View } from "react-native"

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