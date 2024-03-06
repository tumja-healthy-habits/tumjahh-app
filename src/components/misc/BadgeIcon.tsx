import { Ionicons } from '@expo/vector-icons';
import { View } from "react-native";
import { Badge } from 'react-native-paper';

type BadgeIconProps = any & {
    badgeCount: number,
}

export default function BadgeIcon({ badgeCount, ...iconProps }: BadgeIconProps) {
    return <View>
        <Ionicons {...iconProps} />
        <Badge size={20} style={{ position: "absolute", top: 0, right: 0 }}>{badgeCount}</Badge>
    </View>
}