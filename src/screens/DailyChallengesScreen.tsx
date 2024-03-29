import CameraModal from "components/camera/CameraModal";
import ChallengeSelectionModal from "components/challenges/ChallengeSelectionModal";
import WeeklyChallengeButton from "components/challenges/WeeklyChallengeButton";
import WeeklyChallengeModal from "components/challenges/WeeklyChallengeModal";
import Colors from "constants/colors";
import { useState } from "react";
import { FlatList, ListRenderItemInfo, SafeAreaView, Text, View } from "react-native";
import { Button, FAB } from "react-native-paper";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { useWeeklyChallenges } from "src/store/WeeklyChallengesProvider";
import { globalStyles } from "src/styles";
import { WeeklyChallengesRecord } from "types";

export default function DailyChallengesScreen() {
    const weeklyChallenges: WeeklyChallengesRecord[] = useWeeklyChallenges()
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

    console.log(weeklyChallenges)

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
                    bottom: 20,
                }}
                label="Edit your challenges"
            />
            <WeeklyChallengeModal visible={showTestModal} onClose={() => setShowTestModal(false)} />
            <ChallengeSelectionModal visible={showChallengesModal} onClose={() => setShowChallengesModal(false)} />
            <CameraModal weeklyChallenge={cameraModalChallenge} onClose={() => setCameraModalChallenge(undefined)} />
        </SafeAreaView>
    )
}