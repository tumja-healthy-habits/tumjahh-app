import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import BlurModal from "components/misc/BlurModal";
import IconButton from "components/misc/IconButton";
import FriendRequestList from "components/profile/FriendRequestList";
import FriendSearch from "components/profile/FriendSearch";
import ProfilePreview from "components/profile/ProfilePreview";
import UserQRCode from "components/profile/UserQRCode";
import Colors from "constants/colors";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import FriendList from "./FriendList";
import { ProfileParamList } from "./ProfileNavigator";

export default function SearchFriendScreen() {
    const { params } = useRoute<RouteProp<ProfileParamList, 'SearchFriend'>>()
    const [showQRCode, setShowQRCode] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>("")

    const { setParams, goBack } = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()

    return <SafeAreaView style={styles.container}>
        <IconButton icon="chevron-back-outline" onPress={goBack} color="#666" size={30} style={{ alignSelf: "flex-start", marginLeft: 5 }} />
        <BlurModal visible={showQRCode} onClose={() => setShowQRCode(false)}>
            <UserQRCode />
        </BlurModal>
        <BlurModal visible={params.friendId !== undefined} onClose={() => setParams({ friendId: undefined })}>
            {params.friendId && <ProfilePreview userId={params.friendId} onClose={() => setParams({ friendId: undefined })} />}
        </BlurModal>
        <FriendSearch showQRCode={() => setShowQRCode(true)} searchText={searchText} setSearchText={setSearchText} />
        {searchText === "" && <>
            <FriendRequestList />
            <FriendList />
        </>}
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.backgroundProfile,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    }
});