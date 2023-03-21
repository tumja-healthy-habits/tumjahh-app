import { Text, TextInput, TextInputProps } from "react-native"
import { View } from "react-native"

type LabelledTextInputProps = TextInputProps & {
    label: string,
}

export default function LabelledTextInput(props: LabelledTextInputProps) {
    const { label, ...inputProps } = props
    return <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ paddingRight: 15 }}>{label}</Text>
        <TextInput {...inputProps} />
    </View>
}