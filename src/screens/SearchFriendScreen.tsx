import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import BlurModal from "components/BlurModal";
import FriendSearch from "components/FriendSearch";
import ProfilePreview from "components/ProfilePreview";
import UserQRCode from "components/UserQRCode";
import Colors from "constants/colors";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ProfileParamList } from "./ProfileNavigator";

export default function SearchFriendScreen() {
    const { params } = useRoute<RouteProp<ProfileParamList, 'SearchFriend'>>()
    const [showQRCode, setShowQRCode] = useState<boolean>(false)
    const { setParams } = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()

    return <SafeAreaView style={styles.container}>
        <BlurModal visible={showQRCode} onClose={() => setShowQRCode(false)}>
            <UserQRCode />
        </BlurModal>
        <BlurModal visible={params.friendId !== undefined} onClose={() => setParams({ friendId: undefined })}>
            {params.friendId && <ProfilePreview userId={params.friendId} />}
        </BlurModal>
        <FriendSearch showQRCode={() => setShowQRCode(true)} />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.pastelViolet,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    }
});