import CameraModal from "components/camera/CameraModal";
import ChallengeSelectionModal from "components/challenges/ChallengeSelectionModal";
import WeeklyChallengeButton from "components/challenges/DailyChallengeButton";
import Colors from "constants/colors";
import { useState } from "react";
import { Button, FlatList, ListRenderItemInfo, SafeAreaView, Text, View } from "react-native";
import { FAB } from "react-native-paper";
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
        <SafeAreaView style={[globalStyles.container, { justifyContent: "flex-start", backgroundColor: Colors.pastelViolet, paddingTop: 10, width: "100%" }]}>
            <Text style={globalStyles.textfieldTitle}>Hi, {currentUser.name}.</Text>
            {weeklyChallenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowChallengesModal(true)} color={Colors.accent} />
                : <FlatList
                    data={weeklyChallenges}
                    keyExtractor={(challenge, index) => challenge.id + index}
                    renderItem={renderChallenge}
                />}
            <FAB
                icon="plus"
                style={{ margin: 16 }}
                onPress={() => setShowChallengesModal(true)}
            />
            <ChallengeSelectionModal visible={showChallengesModal} onClose={() => setShowChallengesModal(false)} />
            <CameraModal weeklyChallenge={cameraModalChallenge} onClose={() => setCameraModalChallenge(undefined)} />
        </SafeAreaView>
    )
}