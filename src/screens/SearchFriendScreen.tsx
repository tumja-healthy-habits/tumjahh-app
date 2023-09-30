import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ActionButton from "components/ActionButton";
import { View, Image, Text } from "react-native";
import { ProfileParamList } from "./ProfileNavigator";
import UserQRCode from "components/UserQRCode";
import { useState } from "react";
import Colors from "constants/colors";
import BlurModal from "components/BlurModal";
import ProfilePreview from "components/ProfilePreview";

export default function SearchFriendScreen() {
    // const navigation = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()
    const { params } = useRoute<RouteProp<ProfileParamList, 'SearchFriend'>>()
    console.log("getting these params:", params)
    const [friendId, setFriendId] = useState<string>(params?.friendId || "")
    const [showQRCode, setShowQRCode] = useState<boolean>(false)

    return <View style={{ backgroundColor: Colors.pastelGreen, flex: 1 }}>
        <BlurModal visible={showQRCode} onClose={() => setShowQRCode(false)}>
            <UserQRCode />
        </BlurModal>
        <BlurModal visible={friendId !== ""} onClose={() => setFriendId("")}>
            <ProfilePreview userId={friendId} />
        </BlurModal>
        <ActionButton title="Show your QR code" onPress={() => setShowQRCode(true)} />
        {/* <ActionButton title="test" onPress={() => navigation.navigate('AddFriend', {
            userId: '123',
        })} /> */}
        <ActionButton title="Add Friend Modal" onPress={() => setFriendId("0v5nlflehtbnnco")} />
    </View>
}