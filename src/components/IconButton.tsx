import { Pressable, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

type IconButtonProps = {
    icon: any,
    color: string,
    size: number,
    onPress: () => void,
    style?: {},
}

export default function IconButton({ icon, color, size, onPress, style }: IconButtonProps) {
    return (
        <Pressable style={({ pressed }) => [style, { opacity: pressed ? 0.5 : 1 }]} onPress={onPress}>
            <Ionicons name={icon} color={color} size={size} />
        </Pressable>
    )
}