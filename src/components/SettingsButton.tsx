import { Pressable, Text } from "react-native";

export default function SettingsButton() {

    return (
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]} onPress={() => console.log("settings")}>
            <Text style={{ fontSize: 30 }}>⚙️</Text>
        </Pressable>
    )
}