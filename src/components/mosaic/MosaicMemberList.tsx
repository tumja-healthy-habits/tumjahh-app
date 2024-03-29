import ProfilePicture from "components/profile/ProfilePicture";
import { useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import { MosaicMembersRecord, MosaicRecord, UserRecord } from "types";

type MosaicMemberListProps = {
    mosaicRecord: MosaicRecord,
}

export default function MosaicMemberList({ mosaicRecord }: MosaicMemberListProps) {
    const [members, setMembers] = useState<UserRecord[]>([])

    useEffect(() => {
        pb.collection("mosaic_members").getFullList<MosaicMembersRecord>({
            filter: `mosaic_id = "${mosaicRecord.id}"`,
            expand: "user_id",
        }).then((records: MosaicMembersRecord[]) => {
            setMembers(records.map((record: MosaicMembersRecord) => record.expand.user_id))
        })
    }, [])

    function renderMember({ item }: ListRenderItemInfo<UserRecord>) {
        return <View style={styles.memberContainer}>
            <ProfilePicture userRecord={item} style={styles.profilePicture} />
            <Text style={styles.memberName}>{item.name}</Text>
        </View>
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={members}
                renderItem={renderMember}
                keyExtractor={(item) => item.name}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
    memberContainer: {
        alignItems: "center",
    },
    // profilePicture: {
    //     height: 40,
    //     width: 40,
    //     borderRadius: 20,
    //     borderWidth: 1,
    // },
    profilePicture: {
        width:60, 
        height:60,
        borderRadius:8,
        borderWidth:1
    },
    memberName: {
        fontSize: 14,
    }
})