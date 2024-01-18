import { NavigationProp, useNavigation } from "@react-navigation/native";
import CameraModal from "components/camera/CameraModal";
import ChallengeSelectionModal from "components/challenges/ChallengeSelectionModal";
import WeeklyChallengeButton from "components/challenges/DailyChallengeButton";
import { AppParamList } from "components/LoggedInApp";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import { Button, FlatList, ListRenderItemInfo, SafeAreaView, Text, View } from "react-native";
import { useRealTimeCollection } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles } from "src/styles";
import { WeeklyChallengesRecord } from "types";

export default function DailyChallengesScreen() {
    const challenges = useRealTimeCollection<WeeklyChallengesRecord>("weekly_challenges", [], {
        expand: "challenge_id",
    })
    const { currentUser } = useAuthenticatedUser()

    const [showChallengesModal, setShowChallengesModal] = useState<boolean>(false)
    const [cameraModalChallenge, setCameraModalChallenge] = useState<WeeklyChallengesRecord>()

    const { setOptions } = useNavigation<NavigationProp<AppParamList, "Challenges">>()

    useEffect(() => {
        setOptions({
            headerRight: () => <Button title="Edit" onPress={() => setShowChallengesModal(true)} color={Colors.anotherPeachColor} />,
        })
    }, [])

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
        <SafeAreaView style={[globalStyles.container, { backgroundColor: Colors.pastelViolet, paddingTop: 10, width: "100%" }]}>
            <Text style={globalStyles.textfieldTitle}>Hi, {currentUser.name}.</Text>
            {challenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowChallengesModal(true)} color={Colors.accent} />
                : <FlatList
                    data={challenges}
                    keyExtractor={(challenge, index) => challenge.id + index}
                    renderItem={renderChallenge}
                />}
            <ChallengeSelectionModal visible={showChallengesModal} onClose={() => setShowChallengesModal(false)} />
            <CameraModal weeklyChallenge={cameraModalChallenge} onClose={() => setCameraModalChallenge(undefined)} />
        </SafeAreaView>
    )
}