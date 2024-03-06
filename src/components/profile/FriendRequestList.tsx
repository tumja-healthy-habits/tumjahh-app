import { FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import { useRealTimeCollection } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { FriendRequestsRecord } from "types";
import FriendRequest from "./FriendRequest";

export default function FriendRequestList() {
    const { currentUser } = useAuthenticatedUser()

    const friendRequests: FriendRequestsRecord[] = useRealTimeCollection<FriendRequestsRecord>("friend_requests", [], {
        filter: `to = "${currentUser?.id}"`,
    })

    function renderRequest({ item }: ListRenderItemInfo<FriendRequestsRecord>) {
        return <FriendRequest friendRequest={item} />
    }

    return friendRequests.length > 0 ? <View>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", margin: 20 }}>Open friend requests:</Text>
        <Divider />
        <FlatList data={friendRequests}
            keyExtractor={(request: FriendRequestsRecord) => request.id}
            renderItem={renderRequest}
            ItemSeparatorComponent={() => <Divider />}
        />
    </View> : null
}
