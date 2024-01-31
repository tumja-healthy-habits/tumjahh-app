import Colors from "constants/colors";
import { useState } from "react";
import { FlatList, ListRenderItemInfo, Modal, SafeAreaView, StyleSheet, Text } from "react-native";
import { Button, FAB } from "react-native-paper";
import { useWeeklyChallenges } from "src/store/WeeklyChallengesProvider";
import { globalStyles } from "src/styles";
import { WeeklyChallengesRecord } from "types";
import ChallengeGoalCard from "./ChallengeGoalCard";
import ChallengeSelectionModal from "./ChallengeSelectionModal";

type WeeklyChallengeModalProps = {
    visible: boolean,
    onClose?: () => void,
}

export default function WeeklyChallengeModal({ visible, onClose }: WeeklyChallengeModalProps) {

    const [showChallengesModal, setShowChallengesModal] = useState<boolean>(false)

    const weeklyChallenges: WeeklyChallengesRecord[] = useWeeklyChallenges()

    function renderChallengeGoal({ item }: ListRenderItemInfo<WeeklyChallengesRecord>) {
        return <ChallengeGoalCard weeklyChallenge={item} />
    }

    const ListFooter = () => <Button icon="plus" onPress={() => setShowChallengesModal(true)} style={styles.addButton}>Add new challenge</Button>

    return (
        <Modal visible={visible} onDismiss={onClose} style={styles.modalContainer}>
            <SafeAreaView style={styles.innerContainer}>
                <Text style={globalStyles.textfieldTitle}>Set your goals for the week</Text>
                <FlatList
                    data={weeklyChallenges}
                    renderItem={renderChallengeGoal}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={ListFooter}
                    ListFooterComponentStyle={{
                        shadowColor: Colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        borderRadius: 10,
                        elevation: 5,
                    }}
                    style={{ flex: 1, width: "90%", marginTop: 10 }}
                />
                <FAB
                    onPress={onClose}
                    icon="check"
                    style={styles.removeButton}
                    label="Save your goals"
                />
                <ChallengeSelectionModal visible={showChallengesModal} onClose={() => setShowChallengesModal(false)} />
            </SafeAreaView>
        </Modal >
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.pastelOrange,
    },
    innerContainer: {
        backgroundColor: Colors.pastelOrange,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        borderRadius: 10,
        elevation: 5,
        margin: 10,
    },
    removeButton: {
        backgroundColor: Colors.white,
        position: "absolute",
        bottom: 45,
    }
})