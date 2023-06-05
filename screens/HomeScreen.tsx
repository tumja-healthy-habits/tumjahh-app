import { pb } from "src/pocketbaseService";
import { styles } from "src/styles";
import { View, Text, SectionList, SectionListRenderItem, SectionListRenderItemInfo } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import LoginForm from "components/LoginForm";
import { ChallengesRecord, HabitsRecord } from "types";
import { useEffect, useState } from "react";
import Counter from "react-native-counters"


export default function HomeScreen() {
    const { currentUser } = useAuthenticatedUser()
    const [habits, setHabits] = useState<HabitsRecord[]>([])
    const [challenges, setChallenges] = useState<ChallengesRecord[]>([])

    const data: any = habits.map(habit => ({
        title: habit.name,
        data: challenges.filter(({ habit_id }) => habit_id === habit.id),
    }))

    useEffect(() => {
        async function fetchData() {
            const habits: HabitsRecord[] = await pb.collection("habits").getFullList<HabitsRecord>()
            const challenges: ChallengesRecord[] = await pb.collection("challenges").getFullList<ChallengesRecord>()
            setHabits(habits)
            setChallenges(challenges)
        }
        fetchData()
    }, [])

    if (currentUser === null) {
        return (
            <LoginForm />
        )
    }

    function renderChallenge({ item }: SectionListRenderItemInfo<ChallengesRecord, HabitsRecord>) {
        return (
            <View style={styles.container}>
                <Text style={styles.textfieldText}>{item.name}</Text>
                <Counter start={0} onChange={(count: number) => { }} />
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
                renderSectionHeader={({ section }) => <Text style={[styles.textfieldText, styles.textfieldTitle]}>{section.title}</Text>}
            />}
        </View>
    )
}