import { useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { pb, useRealTimeSubscription } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { FriendRequestsRecord } from "types";
import FriendRequest from "./FriendRequest";

export default function FriendRequestList() {
    const { currentUser } = useAuthenticatedUser()
    const [incomingRequests, setIncomingRequests] = useState<FriendRequestsRecord[]>([])
    const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestsRecord[]>([])
    const [selectedTab, setSelectedTab] = useState<string>("incoming")

    useRealTimeSubscription<FriendRequestsRecord>("friend_requests", {
        onCreate: (record: FriendRequestsRecord) => {
            if (record.to === currentUser!.id) {
                setIncomingRequests((oldRequests: FriendRequestsRecord[]) => [...oldRequests, record])
            } else if (record.from === currentUser!.id) {
                setOutgoingRequests((oldRequests: FriendRequestsRecord[]) => [...oldRequests, record])
            }
        },
        onDelete: (record: FriendRequestsRecord) => {
            if (record.to === currentUser!.id) {
                setIncomingRequests((oldRequests: FriendRequestsRecord[]) => oldRequests.filter((request: FriendRequestsRecord) => request.id !== record.id))
            } else if (record.from === currentUser!.id) {
                setOutgoingRequests((oldRequests: FriendRequestsRecord[]) => oldRequests.filter((request: FriendRequestsRecord) => request.id !== record.id))
            }
        },
    }, [])

    useEffect(() => {
        if (currentUser === null) {
            setIncomingRequests([])
            setOutgoingRequests([])
            return
        }
        pb.collection("friend_requests").getFullList<FriendRequestsRecord>().then((requests: FriendRequestsRecord[]) => {
            setIncomingRequests(requests.filter((request: FriendRequestsRecord) => request.to === currentUser.id))
            setOutgoingRequests(requests.filter((request: FriendRequestsRecord) => request.from === currentUser.id))
        }).catch(console.error)
    }, [currentUser])

    function renderRequest({ item }: ListRenderItemInfo<FriendRequestsRecord>) {
        return <FriendRequest friendRequest={item} incoming={selectedTab === "incoming"} />
    }

    const buttons: any = [
        {
            value: "incoming",
            label: "Incoming",
        },
        {
            value: "outgoing",
            label: "Outgoing",
        },
    ]

    return <View>
        <SegmentedButtons buttons={buttons} onValueChange={setSelectedTab} value={selectedTab} />
        <FlatList data={selectedTab === "incoming" ? incomingRequests : outgoingRequests}
            keyExtractor={(request: FriendRequestsRecord) => request.id}
            renderItem={renderRequest}
        />
    </View>
}
