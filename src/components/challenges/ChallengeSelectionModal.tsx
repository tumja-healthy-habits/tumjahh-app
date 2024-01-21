import Colors from "constants/colors"
import React, { useEffect } from "react"
import { ActivityIndicator, FlatList, ListRenderItemInfo, Modal, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { Divider, FAB } from "react-native-paper"
import { pb, useCollection, useRealTimeSubscription } from "src/pocketbaseService"
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider"
import { globalStyles } from "src/styles"
import { oneWeekAgo } from "src/utils"
import { ChallengesRecord, UserRecord, WeeklyChallengesRecord } from "types"
import ChallengeCard from "./ChallengeCard"

export const VAR_CHALLENGES: string = "BeHealthyChallenges"

type ChallengeSelectionModalProps = {
    visible: boolean,
    onClose?: () => void,
}

export default function ChallengeSelectionModal({ visible, onClose }: ChallengeSelectionModalProps) {

    const { currentUser } = useAuthenticatedUser()
    const [selectedChallenges, setSelectedChallenges] = React.useState<ChallengesRecord[]>([])
    const [challengesToAdd, setChallengesToAdd] = React.useState<ChallengesRecord[]>([])
    const [challengesToRemove, setChallengesToRemove] = React.useState<ChallengesRecord[]>([])
    const challenges: ChallengesRecord[] = useCollection<ChallengesRecord>("challenges", [])

    useRealTimeSubscription<WeeklyChallengesRecord>("weekly_challenges", {
        onDelete: (record: WeeklyChallengesRecord) => {
            if (record.user_id === currentUser!.id) {
                setSelectedChallenges((oldChallenges: ChallengesRecord[]) => oldChallenges.filter((challenge: ChallengesRecord) => challenge.id !== record.challenge_id))
            }
        }
    }, [currentUser])

    if (currentUser === null) return null

    useEffect(() => {
        pb.collection("users").getOne<UserRecord>(currentUser.id, {
            expand: "selectedChallenges",
        }).then((user: UserRecord) => {
            setSelectedChallenges(user.expand.selectedChallenges || [])
        }).catch(console.error)
    }, [currentUser])

    function renderChallenge({ item }: ListRenderItemInfo<ChallengesRecord>) {
        return <ChallengeCard
            challenge={item}
            isChecked={selectedChallenges && selectedChallenges.some((challenge: ChallengesRecord) => challenge.id === item.id)}
            onPress={(isChecked: boolean) => {
                if (isChecked) {
                    if (selectedChallenges.some((challenge: ChallengesRecord) => challenge.id === item.id)) {
                        setChallengesToRemove((oldChallenges: ChallengesRecord[]) => oldChallenges.filter((challenge: ChallengesRecord) => challenge.id !== item.id))
                    } else {
                        setChallengesToAdd((oldChallenges: ChallengesRecord[]) => [...oldChallenges, item])
                    }
                } else {
                    if (!selectedChallenges.some((challenge: ChallengesRecord) => challenge.id === item.id)) {
                        setChallengesToAdd((oldChallenges: ChallengesRecord[]) => oldChallenges.filter((challenge: ChallengesRecord) => challenge.id !== item.id))
                    } else {
                        setChallengesToRemove((oldChallenges: ChallengesRecord[]) => [...oldChallenges, item])
                    }
                }
            }}
        />
    }

    function addMissingChallenges(): Promise<any> {
        return Promise.all(challengesToAdd.map((challenge: ChallengesRecord) => pb.collection("weekly_challenges").create<WeeklyChallengesRecord>({
            user_id: currentUser!.id,
            challenge_id: challenge.id,
            amount_accomplished: 0,
            amount_photos: 0,
            amount_planned: 0,
            last_completed: "1970-01-01 00:00:00",
            start_date: new Date().toISOString().replace("T", " "),
        })))
    }

    function deleteUnwantedChallenges(): Promise<any> {
        return pb.collection("weekly_challenges").getFullList<WeeklyChallengesRecord>({
            filter: `created > "${oneWeekAgo()}"`,
            expand: "challenge_id",
        }).then((weeklyChallenges: WeeklyChallengesRecord[]) => {
            const unwantedChallenges: WeeklyChallengesRecord[] = weeklyChallenges.filter((weeklyChallenge: WeeklyChallengesRecord) =>
                challengesToRemove.some((challenge: ChallengesRecord) => challenge.id === weeklyChallenge.expand.challenge_id.id))
            return Promise.all(unwantedChallenges.map((weeklyChallenge: WeeklyChallengesRecord) => pb.collection("weekly_challenges").delete(weeklyChallenge.id)))
        }).catch(error => console.error("An error occurred while trying to get weekly challenges: ", error))
    }

    function handleConfirm(): void {
        if (currentUser === null) return
        Promise.all([addMissingChallenges(), deleteUnwantedChallenges(), pb.collection("users").update<UserRecord>(currentUser.id, {
            selectedChallenges: [...selectedChallenges, ...challengesToAdd].filter((challenge: ChallengesRecord) => !challengesToRemove.some((toRemove: ChallengesRecord) => toRemove.id === challenge.id)).map((challenge: ChallengesRecord) => challenge.id),
        })]).then(() => {
            if (onClose) {
                onClose()
            }
        }).catch(error => console.error("An error occurred while trying to update the selected challenges: ", error))
            .finally(() => {
                setChallengesToAdd([])
                setChallengesToRemove([])
            })
    }

    // rendered at the end of the list
    const ListFooter = () => //<ActionButton title="Confirm selection" onPress={handleConfirm} />
    (
        null
    )

    // rendered between the challenge cards
    const ItemSeparator = () => <View style={{ padding: 10 }} />

    // rendered when the data passed to the list is empty
    const ListEmpty = () => <ActivityIndicator color={Colors.accent} size="large" />

    // always rendered on top of the list
    const ListHeader = () => <View style={{ paddingTop: 20, backgroundColor: Colors.pastelOrange }}>
        <Text style={globalStyles.textfieldTitle}>Pick your challenges</Text>
        <Divider style={{ marginTop: 15 }} />
    </View>

    return (
        <Modal
            visible={visible}
            onDismiss={onClose}
            animationType="slide"
            style={styles.modalContainer}
        >
            <SafeAreaView >
                <FlatList
                    data={challenges}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChallenge}
                    ListFooterComponent={ListFooter}
                    ItemSeparatorComponent={ItemSeparator}
                    ListEmptyComponent={ListEmpty}
                    ListHeaderComponent={ListHeader}
                    stickyHeaderIndices={[0]}
                    style={{ backgroundColor: Colors.pastelOrange }}
                />
                <FAB
                    onPress={handleConfirm}
                    icon="check"
                    style={{
                        alignSelf: "center",
                        backgroundColor: Colors.white,
                        position: "absolute",
                        bottom: 45,
                    }}
                    label="Confirm selection"
                />
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.pastelOrange,
        borderRadius: 20,
    },
})