import React from "react";
import Colors from "constants/colors";
import { styles } from "src/styles";
import ContentBox from "./ContentBox";
import { Text } from "react-native";
import Counter from "react-native-counters";
import { LocalStorageChallengeEntry } from "types";

type ChallengeCardProps = {
    challengeEntry: LocalStorageChallengeEntry,
    setChallenges: React.Dispatch<React.SetStateAction<LocalStorageChallengeEntry[]>>, // These types...
}

export default function ChallengeCard({ challengeEntry, setChallenges }: ChallengeCardProps) {
    const { record, repetitionsGoal } = challengeEntry

    function updateChallenges(count: number): void {
        setChallenges((oldChallenges: LocalStorageChallengeEntry[]) =>
            oldChallenges.map((oldChallenge: LocalStorageChallengeEntry) =>
                oldChallenge.record.id === record.id ? {
                    ...oldChallenge,
                    repetitionsGoal: count,
                } : oldChallenge
            )
        )
    }


    return (
        <ContentBox style={repetitionsGoal === 0 && { opacity: 0.8 }}>
            <Text style={[styles.textfieldText, repetitionsGoal === 0 && { opacity: 0.5 }, { marginBottom: 15 }]}>{record.name}</Text>
            <Counter
                start={repetitionsGoal}
                onChange={updateChallenges}
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