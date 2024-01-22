import { Ionicons } from '@expo/vector-icons';
import { Pressable } from "react-native";

type IconButtonProps = {
    icon: any,
    color: string,
    size: number,
    onPress?: () => void,
    style?: {},
}

export default function IconButton({ icon, color, size, onPress, style }: IconButtonProps) {
    return (
        <Pressable style={({ pressed }) => [style, { opacity: pressed ? 0.5 : 1 }]} onPress={onPress}>
            <Ionicons name={icon} color={color} size={size} />
        </Pressable>
    )
}