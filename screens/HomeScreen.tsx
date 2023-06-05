import { pb } from "src/pocketbaseService";
import { styles } from "src/styles";
import { View, Text, SectionList, SectionListRenderItem, SectionListRenderItemInfo, SectionListData, ListRenderItemInfo, Button } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import LoginForm from "components/LoginForm";
import { ChallengesRecord, HabitsRecord } from "types";
import { useEffect, useState } from "react";
import Counter from "react-native-counters"
import Colors from "constants/colors";


export default function HomeScreen() {
    const { currentUser } = useAuthenticatedUser()
    const [habits, setHabits] = useState<HabitsRecord[]>([])
    const [challenges, setChallenges] = useState<ChallengesRecord[]>([])

    const data: any = habits.map(habit => ({
        title: habit.name,
        data: challenges.filter(({ habit_id }) => habit_id === habit.id),
    }))

    useEffect(() => {
        Promise.all([pb.collection("habits").getFullList<HabitsRecord>(), pb.collection("challenges").getFullList<ChallengesRecord>()])
            .then(([habits, challenges]) => {
                setHabits(habits)
                setChallenges(challenges)
            })
    }, [])

    if (currentUser === null) {
        return (
            <LoginForm />
        )
    }

    function renderSectionHeader({ section }: any) {
        return (
            <Text style={[styles.textfieldText, styles.textfieldTitle]}>{section.title}</Text>
        )
    }

    function renderChallenge({ item }: SectionListRenderItemInfo<ChallengesRecord, HabitsRecord>) {
        return (
            <View style={styles.container}>
                <Text style={styles.textfieldText}>{item.name}</Text>
                <Counter
                    start={0}
                    onChange={(count: number) => { }}
                    buttonStyle={{
                        borderColor: Colors.accent,
                    }}
                    countTextStyle={{
                        color: Colors.accent,
                    }}
                    buttonTextStyle={{
                        color: Colors.accent,
                    }}
                />
            </View>
        )
    }

    // show the list of potential challenges
    return (
        <View style={styles.container}>
            {data.length > 0 && <SectionList
                sections={data}
                keyExtractor={(item, index) => item.id + index}
                renderItem={renderChallenge}
                renderSectionHeader={renderSectionHeader}
            />}
            <Button title="Save changes" onPress={() => { }} color={Colors.accent} />
        </View>
    )
}