import { NavigationProp, useNavigation } from "@react-navigation/native";
import ChallengeSelectionModal from "components/ChallengeSelectionModal";
import DailyChallengeButton from "components/DailyChallengeButton";
import { AppParamList } from "components/LoggedInApp";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import { Button, FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { DailyChallenge, useDailyChallenges } from "src/store/DailyChallengesProvider";
import { styles } from "src/styles";

export default function DailyChallengesScreen() {
    const { challenges } = useDailyChallenges()
    const [showModal, setShowModal] = useState<boolean>(false)
    const { currentUser } = useAuthenticatedUser()

    const { setOptions } = useNavigation<NavigationProp<AppParamList, "Home">>()

    useEffect(() => {
        setOptions({
            headerRight: () => <Button title="Edit" onPress={() => setShowModal(true)} color={Colors.anotherPeachColor} />,
        })
    }, [])

    if (currentUser === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.textfieldTitle}>You need to be logged in to use this feature</Text>
            </View>
        )
    }

    function renderChallenge({ item }: ListRenderItemInfo<DailyChallenge>) {
        return <DailyChallengeButton dailyChallenge={item} />
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors.pastelViolet, paddingTop: 10, width: "100%" }]}>
            <Text style={styles.textfieldTitle}>Hi, {currentUser.name}.</Text>
            {challenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowModal(true)} color={Colors.accent} />
                : <FlatList
                    data={challenges}
                    keyExtractor={({ challengeEntry }, index) => challengeEntry.record.id + index}
                    renderItem={renderChallenge}
                />}
            <ChallengeSelectionModal visible={showModal} onClose={() => setShowModal(false)} />
        </View>
    )
}