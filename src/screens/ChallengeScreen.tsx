import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppParamList } from "components/LoggedInApp";
import ChallengeCard from "components/challenges/ChallengeGoalCard";
import ChallengeSelectionModal from "components/challenges/ChallengeSelectionModal";
import ActionButton from "components/misc/ActionButton";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import { Button, FlatList, ListRenderItemInfo, View } from "react-native";
import { DailyChallenge, useDailyChallenges } from "src/store/DailyChallengesProvider";
import { globalStyles } from "src/styles";

export default function ChallengeScreen() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const { setOptions } = useNavigation<NavigationProp<AppParamList, "Challenges">>()
    const { challenges } = useDailyChallenges()

    useEffect(() => {
        setOptions({
            headerRight: () => <Button title="Edit" onPress={() => setShowModal(true)} color={Colors.anotherPeachColor} />,
        })
    }, [])

    function renderChallenge({ item }: ListRenderItemInfo<DailyChallenge>) {
        return <ChallengeCard challengeEntry={item.challengeEntry} />
    }

    return (
        <View style={[globalStyles.container, { paddingTop: 10 }]}>
            {challenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowModal(true)} color={Colors.accent} />
                : <>
                    <FlatList
                        data={challenges}
                        keyExtractor={({ challengeEntry }, index) => challengeEntry.record.id + index}
                        renderItem={renderChallenge}
                    />
                    <ActionButton title="Save changes" onPress={() => { }} />
                </>}
            <ChallengeSelectionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
            />
        </View>
    )
}