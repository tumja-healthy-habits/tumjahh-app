import { NavigationProp, useNavigation } from "@react-navigation/native";
import ActionButton from "components/ActionButton";
import { View, Text, Modal, Pressable } from "react-native";
import { ProfileParamList } from "./ProfileNavigator";
import UserQRCode from "components/UserQRCode";
import { useState } from "react";
import { BlurView } from "expo-blur";
import Colors from "constants/colors";

export default function SearchFriendScreen() {
    const navigation = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()
    const [showQRCode, setShowQRCode] = useState<boolean>(false)

    return <View style={{ backgroundColor: Colors.pastelGreen, flex: 1 }}>
        <Modal visible={showQRCode} transparent animationType="fade" onRequestClose={() => setShowQRCode(false)}>
            <Pressable onPress={() => setShowQRCode(false)} style={{ flex: 1, }}>
                <BlurView intensity={50} style={{ flex: 1, justifyContent: "center" }}>
                    <UserQRCode />
                </BlurView>
            </Pressable>
        </Modal>
        <ActionButton title="Show your QR code" onPress={() => setShowQRCode(true)} />
        <ActionButton title="test" onPress={() => navigation.navigate('AddFriend', {
            userId: '123',
        })} />
    </View>
}