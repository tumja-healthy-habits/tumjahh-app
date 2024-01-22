import Colors from "constants/colors"
import React from "react"
import { ActivityIndicator, FlatList, ListRenderItemInfo, Modal, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { Divider, FAB } from "react-native-paper"
import { pb, useCollection } from "src/pocketbaseService"
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider"
import { useWeeklyChallenges } from "src/store/WeeklyChallengesProvider"
import { globalStyles } from "src/styles"
import { ChallengesRecord, WeeklyChallengesRecord } from "types"
import ChallengeCard from "./ChallengeCard"

export const VAR_CHALLENGES: string = "BeHealthyChallenges"

type ChallengeSelectionModalProps = {
    visible: boolean,
    onClose?: () => void,
}

export default function ChallengeSelectionModal({ visible, onClose }: ChallengeSelectionModalProps) {

    const { currentUser } = useAuthenticatedUser()
    const [challengesToAdd, setChallengesToAdd] = React.useState<ChallengesRecord[]>([])
    const [challengesToRemove, setChallengesToRemove] = React.useState<ChallengesRecord[]>([])
    const challenges: ChallengesRecord[] = useCollection<ChallengesRecord>("challenges", [])
    const weeklyChallenges: WeeklyChallengesRecord[] = useWeeklyChallenges()

    function renderChallenge({ item }: ListRenderItemInfo<ChallengesRecord>) {
        function checked(wChallenges: WeeklyChallengesRecord[]): boolean {
            return wChallenges.some((weeklyChallenge: WeeklyChallengesRecord) => weeklyChallenge.challenge_id === item.id)
        }

        return <ChallengeCard
            challenge={item}
            isChecked={checked(weeklyChallenges)}
            onPress={(isChecked: boolean) => {
                if (isChecked) {
                    if (checked(weeklyChallenges)) {
                        setChallengesToRemove((oldChallenges: ChallengesRecord[]) => oldChallenges.filter((challenge: ChallengesRecord) => challenge.id !== item.id))
                    } else {
                        setChallengesToAdd((oldChallenges: ChallengesRecord[]) => [...oldChallenges, item])
                    }
                } else {
                    if (!checked(weeklyChallenges)) {
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
            amount_planned: 1,
            last_completed: "1970-01-01 00:00:00",
            start_date: new Date().toISOString().replace("T", " "),
        })))
    }

    function deleteUnwantedChallenges(): Promise<any> {
        const unwantedChallenges: WeeklyChallengesRecord[] = weeklyChallenges.filter((weeklyChallenge: WeeklyChallengesRecord) =>
            challengesToRemove.some((challenge: ChallengesRecord) => challenge.id === weeklyChallenge.expand.challenge_id.id))
        return Promise.all(unwantedChallenges.map((weeklyChallenge: WeeklyChallengesRecord) => pb.collection("weekly_challenges").delete(weeklyChallenge.id)))
    }

    function handleConfirm(): void {
        if (currentUser === null) return
        Promise.all([addMissingChallenges(), deleteUnwantedChallenges()]).then(() => {
            if (onClose) {
                onClose()
            }
        }).catch(error => console.error("An error occurred while trying to update the selected challenges: ", error))
            .finally(() => {
                setChallengesToAdd([])
                setChallengesToRemove([])
            })
    }

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
            <SafeAreaView style={styles.modalContainer} >
                <FlatList
                    data={challenges}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChallenge}
                    ItemSeparatorComponent={ItemSeparator}
                    ListEmptyComponent={ListEmpty}
                    ListHeaderComponent={ListHeader}
                    stickyHeaderIndices={[0]}
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
    },
})