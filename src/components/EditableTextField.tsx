import { useState } from "react"
import Colors from "constants/colors"
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native"

type EditableTextFieldProps = {
    fontSize: number,
    placeholder: string,
    editableText: string,
    updateFunction: (update: string) => void,
}

export default function EditableTextField({ fontSize, placeholder, editableText, updateFunction}: EditableTextFieldProps) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [text, setText] = useState<string>(editableText);
    const [tempText, setTempText] = useState<string>(editableText);

    function toggleEditMode(save: boolean) {
        setEditMode(!editMode);
        if (save) {
            updateFunction(tempText);
        }
    }

    return editMode ?
        (<View style={styles.hcontainer}>
            <TextInput style={textFieldStyle(fontSize).textField} placeholder={placeholder} placeholderTextColor={Colors.primaryDark} onChangeText={(text: string) => setTempText(text)}>{text}</TextInput>
            <Pressable style={({ pressed }) => [pressed && styles.opacity]} onPress={() => toggleEditMode(true)}><Text>✔️</Text></Pressable>
        </View>)
        : (<View style={styles.hcontainer}>
            <Text style={textFieldStyle(fontSize).textField}>{text}</Text>
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

const textFieldStyle = (fontSize: number) => StyleSheet.create({
    textField: {
        color: Colors.primary,
        fontSize: fontSize,
    },
})