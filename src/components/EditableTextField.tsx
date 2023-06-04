import { useState } from "react"
import Colors from "constants/colors"
import { styles } from "../styles"
import { Text, View, Pressable, TextInput, TextInputProps } from "react-native"

type EditableTextFieldProps = {
    textStyle: any,
    placeholder: string,
    editableText: string,
    updateFunction: (update: string) => void,
}

export default function EditableTextField({ textStyle, placeholder, editableText, updateFunction}: EditableTextFieldProps) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [text, setText] = useState<string>(editableText);
    const [tempText, setTempText] = useState<string>(editableText);

    function toggleEditMode(save: boolean) {
        setEditMode(!editMode);
        if (save) {
            updateFunction(tempText);
            setText(tempText);
        }
    }

    return editMode ?
        (<View style={styles.hcontainer}>
            <TextInput style={ textStyle } placeholder={placeholder} placeholderTextColor={Colors.primaryDark} onChangeText={(text: string) => setTempText(text)}>{text}</TextInput>
            <Pressable style={({ pressed }) => [pressed && styles.pressedOpacity]} onPress={() => toggleEditMode(true)}><Text>✔️</Text></Pressable>
        </View>)
        : (<View style={styles.hcontainer}>
            <Text style={ textStyle }>{text}</Text>
            <Pressable style={({ pressed }) => [pressed && styles.pressedOpacity]} onPress={() => toggleEditMode(false)}><Text>✏️</Text></Pressable>
        </View>)
}