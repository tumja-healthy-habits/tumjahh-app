import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import BlurModal from "components/misc/BlurModal";
import FriendRequestList from "components/profile/FriendRequestList";
import FriendSearch from "components/profile/FriendSearch";
import ProfilePreview from "components/profile/ProfilePreview";
import UserQRCode from "components/profile/UserQRCode";
import Colors from "constants/colors";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ProfileParamList } from "./ProfileNavigator";

export default function SearchFriendScreen() {
    const { params } = useRoute<RouteProp<ProfileParamList, 'SearchFriend'>>()
    const [showQRCode, setShowQRCode] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>("")

    const { setParams } = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()

    return <SafeAreaView style={styles.container}>
        <BlurModal visible={showQRCode} onClose={() => setShowQRCode(false)}>
            <UserQRCode />
        </BlurModal>
        <BlurModal visible={params.friendId !== undefined} onClose={() => setParams({ friendId: undefined })}>
            {params.friendId && <ProfilePreview userId={params.friendId} onClose={() => setParams({ friendId: undefined })} />}
        </BlurModal>
        <FriendSearch showQRCode={() => setShowQRCode(true)} searchText={searchText} setSearchText={setSearchText} />
        {searchText === "" && <FriendRequestList />}
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.pastelViolet,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    }
});