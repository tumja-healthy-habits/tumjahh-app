import { useState } from "react"
import Colors from "constants/colors"
import { StyleSheet, Text, View, Pressable, TextInput, TextInputProps } from "react-native"

type EditableTextFieldProps = TextInputProps & {
    editableText: string,
    updateFunction: (update: string) => void,
}

export default function EditableTextField({ editableText, updateFunction, style, ...inputProps }: EditableTextFieldProps) {

    const [editMode, setEditMode] = useState<boolean>(false);
    const [text, setText] = useState<string>(editableText);

    function toggleEditMode(save: boolean) {
        setEditMode(!editMode);
        if (save) {
            updateFunction(text);
        }
    }

    return editMode ?
        (<View style={styles.hcontainer}>
            <TextInput style={[styles.textField, style]} placeholderTextColor={Colors.primaryDark} onChangeText={(text: string) => setText(text)} {...inputProps}>{text}</TextInput>
            <Pressable style={({ pressed }) => [pressed && styles.opacity]} onPress={() => toggleEditMode(true)}><Text>✔️</Text></Pressable>
        </View>)
        : (<View style={styles.hcontainer}>
            <Text style={[styles.textField, style]}>{text}</Text>
            <Pressable style={({ pressed }) => [pressed && styles.opacity]} onPress={() => toggleEditMode(false)}><Text>✏️</Text></Pressable>
        </View>)
}

const styles = StyleSheet.create({
    hcontainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textField: {
        color: Colors.primary,
    },
    opacity: {
        opacity: 0.5
    },
})