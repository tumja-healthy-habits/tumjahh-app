import { styles } from "src/styles";
import { View, Text, ListRenderItemInfo, Button, Modal, FlatList } from "react-native";
import { LocalStorageChallengeEntry } from "types";
import { useEffect, useState } from "react";
import Counter from "react-native-counters"
import Colors from "constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChallengeSelectionForm, { VAR_CHALLENGES } from "src/components/ChallengeSelectionForm";

export default function ChallengeScreen() {
    const [challenges, setChallenges] = useState<LocalStorageChallengeEntry[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)

    // get the selected challenges from local storage
    useEffect(() => {
        AsyncStorage.getItem(VAR_CHALLENGES).then((jsonString: string | null) => {
            if (jsonString === null) return
            const challenges: LocalStorageChallengeEntry[] = JSON.parse(jsonString)
            setChallenges(challenges)
        })
    }, [])

    function renderChallenge({ item }: ListRenderItemInfo<LocalStorageChallengeEntry>) {
        const { record, repetitionsGoal } = item

        function updateChallenges(count: number): void {
            setChallenges((oldChallenges: LocalStorageChallengeEntry[]) =>
                oldChallenges.map((oldChallenge: LocalStorageChallengeEntry) =>
                    oldChallenge.record.id === record.id ? {
                        ...oldChallenge,
                        repetitionsGoal: count,
                    } : oldChallenge
                )
            )
        }

        return (
            <View style={[styles.container, { marginVertical: 7 }]}>
                <Text style={[styles.textfieldText, repetitionsGoal === 0 && { opacity: 0.5 }]}>{record.name}</Text>
                <Counter
                    start={repetitionsGoal}
                    onChange={updateChallenges}
                    buttonStyle={{
                        borderColor: Colors.accent,
                    }}
                    countTextStyle={{
                        color: Colors.accent,
                    }}
                    buttonTextStyle={{
                        color: Colors.accent,
                    }}
                />
            </View>
        )
    }

    async function handleSaveChanges(): Promise<void> {
        const jsonString: string = JSON.stringify(challenges)
        return AsyncStorage.setItem(VAR_CHALLENGES, jsonString)
    }

    // show the list of potential challenges
    return (
        <View style={styles.container}>
            {challenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowModal(true)} color={Colors.accent} /> : <>
                <FlatList
                    data={challenges}
                    keyExtractor={({ record }, index) => record.id + index}
                    renderItem={renderChallenge}
                />
                <Button title="Add or remove challenges" onPress={() => setShowModal(true)} color={Colors.accent} />
                <Button title="Save changes" onPress={handleSaveChanges} color={Colors.accent} />
            </>}
            <Modal
                animationType="slide"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <ChallengeSelectionForm onSubmit={(records: LocalStorageChallengeEntry[]) => {
                    setShowModal(false)
                    setChallenges(records)
                }} />
            </Modal>
        </View>
    )
}