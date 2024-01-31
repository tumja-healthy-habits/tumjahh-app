import CameraModal from "components/camera/CameraModal";
import ChallengeSelectionModal from "components/challenges/ChallengeSelectionModal";
import WeeklyChallengeButton from "components/challenges/WeeklyChallengeButton";
import WeeklyChallengeModal from "components/challenges/WeeklyChallengeModal";
import Colors from "constants/colors";
import { useState } from "react";
import { FlatList, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, FAB } from "react-native-paper";
import { useRealTimeCollection } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles } from "src/styles";
import { WeeklyChallengesRecord } from "types";

export default function DailyChallengesScreen() {
    const weeklyChallenges: WeeklyChallengesRecord[] = useRealTimeCollection<WeeklyChallengesRecord>("weekly_challenges", [], {
        expand: "challenge_id",
    })
    const { currentUser } = useAuthenticatedUser()

    const [showChallengesModal, setShowChallengesModal] = useState<boolean>(false)
    const [cameraModalChallenge, setCameraModalChallenge] = useState<WeeklyChallengesRecord>()

    const [showTestModal, setShowTestModal] = useState<boolean>(false)

    if (currentUser === null) {
        return (
            <View style={globalStyles.container}>
                <Text style={globalStyles.textfieldTitle}>You need to be logged in to use this feature</Text>
            </View>
        )
    }

    function renderChallenge({ item }: ListRenderItemInfo<WeeklyChallengesRecord>) {
        return <WeeklyChallengeButton weeklyChallenge={item} openCamera={() => setCameraModalChallenge(item)} />
    }

    return (
        <SafeAreaView style={[globalStyles.container, { justifyContent: "flex-start", backgroundColor: Colors.pastelViolet }]}>
            <Text style={globalStyles.textfieldTitle}>Hi, {currentUser.name}</Text>
            {weeklyChallenges.length === 0 ? <Button onPress={() => setShowChallengesModal(true)} color={Colors.accent}>Select some challenges here :)</Button>
                :
                <FlatList
                    data={weeklyChallenges}
                    keyExtractor={(challenge, index) => challenge.id + index}
                    renderItem={renderChallenge}
                />
            }
            <FAB
                onPress={() => setShowTestModal(true)}
                icon="plus"
                style={{
                    alignSelf: "center",
                    backgroundColor: Colors.white,
                    position: "absolute",
                    bottom: 45,
                }}
                label="Edit your challenges"
            />
            <WeeklyChallengeModal visible={showTestModal} onClose={() => setShowTestModal(false)} />
            <ChallengeSelectionModal visible={showChallengesModal} onClose={() => setShowChallengesModal(false)} />
            <CameraModal weeklyChallenge={cameraModalChallenge} onClose={() => setCameraModalChallenge(undefined)} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        borderRadius: 10,
        elevation: 5,
        margin: 10,
    },
})