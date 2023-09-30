import { NavigationProp, useNavigation } from "@react-navigation/native";
import ActionButton from "components/ActionButton";
import ChallengeCard from "components/ChallengeCard";
import ChallengeSelectionModal from "components/ChallengeSelectionModal";
import { AppParamList } from "components/LoggedInApp";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import { Button, FlatList, ListRenderItemInfo, View } from "react-native";
import { DailyChallenge, useDailyChallenges } from "src/store/DailyChallengesProvider";
import { styles } from "src/styles";

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
        <View style={[styles.container, { paddingTop: 10 }]}>
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