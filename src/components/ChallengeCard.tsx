import Colors from "constants/colors";
import React from "react";
import { Text } from "react-native";
import Counter from "react-native-counters";
import { useDailyChallenges } from "src/store/DailyChallengesProvider";
import { globalStyles } from "src/styles";
import { LocalStorageChallengeEntry } from "types";
import ContentBox from "./ContentBox";

type ChallengeCardProps = {
    challengeEntry: LocalStorageChallengeEntry,
}

export default function ChallengeCard({ challengeEntry }: ChallengeCardProps) {
    const { record, repetitionsGoal } = challengeEntry
    const { setRepetitionGoal } = useDailyChallenges()

    function updateChallenge(count: number): void {
        setRepetitionGoal(record.name, count)
    }

    return (
        <ContentBox style={repetitionsGoal === 0 && { opacity: 0.8 }}>
            <Text style={[globalStyles.textfieldText, repetitionsGoal === 0 && { opacity: 0.5 }, { marginBottom: 15 }]}>{record.name}</Text>
            <Counter
                start={repetitionsGoal}
                onChange={updateChallenge}
                buttonStyle={{
                    borderColor: Colors.anotherPeachColor,
                    backgroundColor: Colors.white,
                }}
                countTextStyle={{
                    color: Colors.anotherPeachColor,
                }}
                buttonTextStyle={{
                    color: Colors.anotherPeachColor,
                }}
            />
        </ContentBox>
    )
}