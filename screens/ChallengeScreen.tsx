import { styles } from "src/styles";
import { View, ListRenderItemInfo, Button, Modal, FlatList, SafeAreaView } from "react-native";
import { LocalStorageChallengeEntry } from "types";
import { useEffect, useState } from "react";
import Colors from "constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChallengeSelectionForm, { VAR_CHALLENGES } from "src/components/ChallengeSelectionForm";
import ActionButton from "components/ActionButton";
import ChallengeCard from "components/ChallengeCard";
import { useNavigation } from "@react-navigation/native";

export default function ChallengeScreen() {
    const [challenges, setChallenges] = useState<LocalStorageChallengeEntry[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const { setOptions } = useNavigation()

    useEffect(() => {
        setOptions({
            headerRight: () => <Button title="Edit" onPress={() => setShowModal(true)} color={Colors.anotherPeachColor} />,
        })
    }, [])

    // get the selected challenges from local storage
    useEffect(() => {
        AsyncStorage.getItem(VAR_CHALLENGES).then((jsonString: string | null) => {
            if (jsonString === null) return
            const challenges: LocalStorageChallengeEntry[] = JSON.parse(jsonString)
            setChallenges(challenges)
        })
    }, [])

    // save the challenges with their repetition counts to local storage
    async function handleSaveChanges(): Promise<void> {
        const jsonString: string = JSON.stringify(challenges)
        return AsyncStorage.setItem(VAR_CHALLENGES, jsonString)
    }

    function renderChallenge({ item }: ListRenderItemInfo<LocalStorageChallengeEntry>) {
        return <ChallengeCard challengeEntry={item} setChallenges={setChallenges} />
    }

    // TODO: purple on click
    // show the list of potential challenges
    return (
        <View style={[styles.container, { paddingTop: 10 }]}>
            {challenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowModal(true)} color={Colors.accent} /> : <>
                <FlatList
                    data={challenges}
                    keyExtractor={({ record }, index) => record.id + index}
                    renderItem={renderChallenge}
                />
                <ActionButton title="Save changes" onPress={handleSaveChanges} />
            </>}
            <Modal
                animationType="slide"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <ChallengeSelectionForm onSubmit={(records: LocalStorageChallengeEntry[]) => {
                        setShowModal(false)
                        setChallenges(records)
                    }} />
                </SafeAreaView>
            </Modal>
        </View>
    )
}