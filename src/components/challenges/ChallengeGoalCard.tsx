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
            .catch(error => console.error("An error occurred while trying to update a challenge: ", error))
    }

    function deleteChallenge(): void {
        pb.collection("weekly_challenges").delete(weeklyChallenge.id)
            .catch(error => console.error("An error occurred while trying to delete a challenge: ", error))
    }

    return (
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <ContentBox style={[goal === 0 && { opacity: 0.8 }, { borderRadius: 10, flex: 9, flexDirection: "row", marginRight: 10 }]} >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", paddingVertical: 5 }}>
                    <Text style={[globalStyles.textfieldText, goal === 0 && { opacity: 0.5 }]}>
                        {weeklyChallenge.expand.challenge_id.name}
                    </Text>
                    <Counter
                        start={weeklyChallenge.amount_planned}
                        min={1}
                        max={21}
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
            <IconButton icon="trash-outline" color={Colors.anotherPeachColor} size={30} onPress={deleteChallenge} />
        </View>
    )
}