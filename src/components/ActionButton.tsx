import Colors from "constants/colors";
import { ButtonProps, Pressable, StyleSheet, Text } from "react-native";

type ActionButtonProps = ButtonProps & {
    pressedColor?: string,
    textColor?: string,
    textPressedColor?: string,
    children?: React.ReactNode,
    title?: string,
}

const DEFAULT_COLOR: string = Colors.black
const DEFAULT_PRESSED_COLOR: string = Colors.pastelViolet
const DEFAULT_TEXT_COLOR: string = Colors.white
const DEFAULT_TEXT_PRESSED_COLOR: string = Colors.black

export default function ActionButton({ onPress, title, color, pressedColor, textColor, textPressedColor, children }: ActionButtonProps) {
    function renderContent(pressed: boolean) {
        if (children) return children
        const color: string = pressed ? (textPressedColor || DEFAULT_TEXT_PRESSED_COLOR) : (textColor || DEFAULT_TEXT_COLOR)
        return <Text style={[styles.buttonText, { color: color }]}>{title}</Text>
    }

    return (
        <Pressable
            style={({ pressed }) => [styles.container, {
                backgroundColor: pressed ? (pressedColor || DEFAULT_PRESSED_COLOR) : (color || DEFAULT_COLOR),
            }]}
            onPress={onPress}
        >
            {({ pressed }) => renderContent(pressed)}
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