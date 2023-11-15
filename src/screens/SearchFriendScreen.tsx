import { RouteProp, useRoute } from "@react-navigation/native";
import ActionButton from "components/ActionButton";
import BlurModal from "components/BlurModal";
import FriendSearch from "components/FriendSearch";
import ProfilePreview from "components/ProfilePreview";
import UserQRCode from "components/UserQRCode";
import Colors from "constants/colors";
import { useState } from "react";
import { View } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { ProfileParamList } from "./ProfileNavigator";

export default function SearchFriendScreen() {
    // const navigation = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()
    const { currentUser, setCurrentUser } = useAuthenticatedUser()
    const { params } = useRoute<RouteProp<ProfileParamList, 'SearchFriend'>>()
    //console.log("getting these params:", params)
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
        <FriendSearch />
    </View>
}