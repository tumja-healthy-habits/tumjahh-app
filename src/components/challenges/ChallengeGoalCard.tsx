import IconButton from "components/misc/IconButton";
import Colors from "constants/colors";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Counter from "react-native-counters";
import { pb } from "src/pocketbaseService";
import { globalStyles } from "src/styles";
import { WeeklyChallengesRecord } from "types";
import ContentBox from "../misc/ContentBox";

type ChallengeGoalCardProps = {
    weeklyChallenge: WeeklyChallengesRecord,
}

export default function ChallengeGoalCard({ weeklyChallenge }: ChallengeGoalCardProps) {
    const [goal, setGoal] = useState<number>(weeklyChallenge.amount_planned)

    function updateChallenge(count: number): void {
        pb.collection("weekly_challenges").update<WeeklyChallengesRecord>(weeklyChallenge.id, {
            amount_planned: count,
        })
            .then(() => setGoal(count))
            .catch(console.error)
    }

    function deleteChallenge(): void {
        pb.collection("weekly_challenges").delete(weeklyChallenge.id).catch(console.error)
    }

    return (
        <View>
            <IconButton icon="trash-outline" color={Colors.anotherPeachColor} size={30} onPress={deleteChallenge} />
            <ContentBox style={[goal === 0 && { opacity: 0.8 }, { borderRadius: 10, flex: 1, flexDirection: "row" }]} >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%" }}>
                    <Text style={[globalStyles.textfieldText, goal === 0 && { opacity: 0.5 }, { marginBottom: 15 }]}>{weeklyChallenge.expand.challenge_id.name}</Text>
                    <Counter
                        start={weeklyChallenge.amount_planned}
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
                </View>
            </ContentBox >
        </View>
    )
}