import { FlatList, ListRenderItemInfo, Text } from "react-native";
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

    return <>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", margin: 20 }}>These persons want to be your friends:</Text>
        <Divider />
        <FlatList data={friendRequests}
            keyExtractor={(request: FriendRequestsRecord) => request.id}
            renderItem={renderRequest}
            ItemSeparatorComponent={() => <Divider />}
        /></>
}
