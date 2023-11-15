import { NavigationProp, useNavigation } from "@react-navigation/native";
import CameraModal from "components/CameraModal";
import ChallengeSelectionModal from "components/ChallengeSelectionModal";
import DailyChallengeButton from "components/DailyChallengeButton";
import { AppParamList } from "components/LoggedInApp";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import { Button, FlatList, ListRenderItemInfo, SafeAreaView, Text, View } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { DailyChallenge, useDailyChallenges } from "src/store/DailyChallengesProvider";
import { globalStyles } from "src/styles";

export default function DailyChallengesScreen() {
    const { challenges } = useDailyChallenges()
    const { currentUser } = useAuthenticatedUser()

    const [showChallengesModal, setShowChallengesModal] = useState<boolean>(false)
    const [cameraModalChallenge, setCameraModalChallenge] = useState<string>()

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

    function renderChallenge({ item }: ListRenderItemInfo<DailyChallenge>) {
        return <DailyChallengeButton dailyChallenge={item} openCamera={(challengeName: string) => setCameraModalChallenge(challengeName)} />
    }

    return (
        <SafeAreaView style={[globalStyles.container, { backgroundColor: Colors.pastelViolet, paddingTop: 10, width: "100%" }]}>
            <Text style={globalStyles.textfieldTitle}>Hi, {currentUser.name}.</Text>
            {challenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowChallengesModal(true)} color={Colors.accent} />
                : <FlatList
                    data={challenges}
                    keyExtractor={({ challengeEntry }, index) => challengeEntry.record.id + index}
                    renderItem={renderChallenge}
                />}
            <ChallengeSelectionModal visible={showChallengesModal} onClose={() => setShowChallengesModal(false)} />
            <CameraModal challengeName={cameraModalChallenge} onClose={() => setCameraModalChallenge(undefined)} />
        </SafeAreaView>
    )
}