import Colors from "constants/colors"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, ListRenderItemInfo, Modal, SafeAreaView, Text, View } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { pb } from "src/pocketbaseService"
import { DailyChallenge, useDailyChallenges } from "src/store/DailyChallengesProvider"
import { globalStyles } from "src/styles"
import { ChallengesRecord, HabitsRecord } from "types"
import ActionButton from "../misc/ActionButton"
import ContentBox from "../misc/ContentBox"

export const VAR_CHALLENGES: string = "BeHealthyChallenges"

type ChallengeSelectionModalProps = {
    visible?: boolean,
    onClose?: () => void,
}

export default function ChallengeSelectionModal({ visible, onClose }: ChallengeSelectionModalProps) {

    const { challenges: dailyChallenges, addChallenge, removeChallenge } = useDailyChallenges()

    const [habits, setHabits] = useState<HabitsRecord[]>([])
    const [challenges, setChallenges] = useState<ChallengesRecord[]>([])

    const data: any = habits.map(habit => ({
        title: habit.name,
        challenges: challenges.filter(({ habit_id }) => habit_id === habit.id),
    }))

    useEffect(() => {
        Promise.all([pb.collection("habits").getFullList<HabitsRecord>(), pb.collection("challenges").getFullList<ChallengesRecord>()])
            .then(([habits, challenges]) => {
                setHabits(habits)
                setChallenges(challenges)
            })
            .catch(() => {
                // only for testing without pocketbase
                setHabits(dummyHabits)
                setChallenges(dummyChallenges)
            })
    }, [])

    function renderChallenge({ item }: ListRenderItemInfo<ChallengesRecord>) {
        return (
            <BouncyCheckbox
                size={25}
                text={item.name}
                isChecked={dailyChallenges.some(({ challengeEntry }: DailyChallenge) => challengeEntry.record.id === item.id)}
                onPress={(isChecked: boolean) => {
                    if (isChecked) {
                        addChallenge(item)
                    } else {
                        removeChallenge(item.name)
                    }
                }}
                textStyle={{
                    textDecorationLine: "none",
                }}
                textContainerStyle={{
                    marginVertical: 10,
                    marginStart: 30,
                }}
                iconStyle={{
                    marginStart: 25,
                }}
                fillColor={Colors.pastelViolet}
                unfillColor={Colors.pastelViolet}
            />
        )
    }

    function renderHabit({ item }: ListRenderItemInfo<HabitsRecord>) {
        return (
            <ContentBox style={{ alignItems: "flex-start" }}>
                <Text style={[globalStyles.textfieldText, globalStyles.textfieldTitle, { marginVertical: 10, alignSelf: "center" }]}>{item.title}</Text>
                <FlatList
                    data={item.challenges}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={renderChallenge}
                />
            </ContentBox>
        )
    }

    function handleConfirm(): void {
        // store the selection in local storage and execute the onSubmit prop (for example for closing a Modal that contains this form)
        // return AsyncStorage.setItem(VAR_CHALLENGES, JSON.stringify(selectedChallenges)).then(() => {
        //     if (onSubmit) {
        //         onSubmit(selectedChallenges)
        //     }
        // })
        if (onClose) {
            onClose()
        }
    }

    // rendered at the end of the list
    const ListFooter = () => <ActionButton title="Confirm selection" onPress={handleConfirm} />

    // rendered between the challenge cards
    const ItemSeparator = () => <View style={{ padding: 10 }} />

    // rendered when the data passed to the list is empty
    const ListEmpty = () => <ActivityIndicator color={Colors.accent} size="large" />

    // always rendered on top of the list
    const ListHeader = () => <View style={{ padding: 20, backgroundColor: Colors.pastelOrange }}>
        <Text style={globalStyles.textfieldTitle}>Pick your challenges</Text>
    </View>

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => item.title + index}
                    renderItem={renderHabit}
                    ListFooterComponent={ListFooter}
                    ItemSeparatorComponent={ItemSeparator}
                    ListEmptyComponent={ListEmpty}
                    ListHeaderComponent={ListHeader}
                    stickyHeaderIndices={[0]}
                />
            </SafeAreaView>
        </Modal>
    )
}

const dummyHabits: HabitsRecord[] = [
    {
        "id": "habit1",
        "name": "Drink 8 glasses of water daily",
        "created": "2023-06-01T09:00:00Z",
        "updated": "2023-06-02T15:30:00Z"
    },
    {
        "id": "habit2",
        "name": "Exercise for 30 minutes",
        "created": "2023-06-01T10:00:00Z",
        "updated": "2023-06-03T12:45:00Z"
    },
    {
        "id": "habit3",
        "name": "Read for 20 minutes",
        "created": "2023-06-02T08:15:00Z",
        "updated": "2023-06-03T14:20:00Z"
    },
    {
        "id": "habit4",
        "name": "Meditate for 10 minutes",
        "created": "2023-06-02T10:30:00Z",
        "updated": "2023-06-04T09:10:00Z"
    },
    {
        "id": "habit5",
        "name": "Eat 5 servings of fruits and vegetables",
        "created": "2023-06-03T12:00:00Z",
        "updated": "2023-06-04T16:40:00Z"
    }
] as HabitsRecord[]


const dummyChallenges: ChallengesRecord[] = [
    {
        "id": "challenge1",
        "name": "Morning Exercise Challenge",
        "description": "Complete a 30-minute workout every morning",
        "explanation": "Regular exercise in the morning helps boost energy levels and improve overall fitness.",
        "habit_id": "habit2",
        "created": "2023-06-01T09:30:00Z",
        "updated": "2023-06-02T10:45:00Z"
    },
    {
        "id": "challenge2",
        "name": "Book Reading Challenge",
        "description": "Read a book for 30 minutes every day",
        "explanation": "Reading books helps broaden knowledge and enhances creativity.",
        "habit_id": "habit3",
        "created": "2023-06-01T11:00:00Z",
        "updated": "2023-06-03T15:20:00Z"
    },
    {
        "id": "challenge3",
        "name": "Mindfulness Meditation Challenge",
        "description": "Practice mindfulness meditation for 10 minutes daily",
        "explanation": "Mindfulness meditation improves focus, reduces stress, and promotes overall well-being.",
        "habit_id": "habit4",
        "created": "2023-06-02T12:15:00Z",
        "updated": "2023-06-04T11:30:00Z"
    },
    {
        "id": "challenge4",
        "name": "Fruit and Vegetable Challenge",
        "description": "Consume 5 servings of fruits and vegetables every day",
        "explanation": "Eating a balanced diet rich in fruits and vegetables provides essential nutrients and promotes good health.",
        "habit_id": "habit5",
        "created": "2023-06-03T14:30:00Z",
        "updated": "2023-06-04T18:50:00Z"
    },
    {
        "id": "challenge5",
        "name": "Hydration Challenge",
        "description": "Drink 8 glasses of water daily",
        "explanation": "Staying hydrated is essential for overall health and well-being.",
        "habit_id": "habit1",
        "created": "2023-06-04T10:00:00Z",
        "updated": "2023-06-04T15:15:00Z"
    },
    {
        "id": "challenge6",
        "name": "Daily Stretching Challenge",
        "description": "Do a 10-minute stretching routine every day",
        "explanation": "Stretching helps improve flexibility, prevent muscle stiffness, and promote better posture.",
        "habit_id": "habit2",
        "created": "2023-06-05T09:30:00Z",
        "updated": "2023-06-05T10:45:00Z"
    },
    {
        "id": "challenge7",
        "name": "Mindful Eating Challenge",
        "description": "Practice mindful eating for one meal every day",
        "explanation": "Mindful eating helps cultivate a healthier relationship with food and enhances the enjoyment of meals.",
        "habit_id": "habit5",
        "created": "2023-06-05T11:00:00Z",
        "updated": "2023-06-05T12:20:00Z"
    },
    {
        "id": "challenge8",
        "name": "Digital Detox Challenge",
        "description": "Unplug from electronic devices for two hours each day",
        "explanation": "Taking regular breaks from digital devices promotes mental well-being and reduces screen time.",
        "habit_id": "habit4",
        "created": "2023-06-05T12:30:00Z",
        "updated": "2023-06-05T13:40:00Z"
    },
    {
        "id": "challenge9",
        "name": "Gratitude Journal Challenge",
        "description": "Write down three things you're grateful for every day",
        "explanation": "Practicing gratitude fosters a positive mindset and cultivates appreciation for the little things in life.",
        "habit_id": "habit3",
        "created": "2023-06-05T14:00:00Z",
        "updated": "2023-06-05T15:15:00Z"
    },
    {
        "id": "challenge10",
        "name": "Yoga Challenge",
        "description": "Complete a 20-minute yoga session every day",
        "explanation": "Yoga enhances flexibility, improves strength, and promotes relaxation and mindfulness.",
        "habit_id": "habit2",
        "created": "2023-06-05T16:00:00Z",
        "updated": "2023-06-05T17:15:00Z"
    },
    {
        "id": "challenge11",
        "name": "Healthy Snacking Challenge",
        "description": "Replace unhealthy snacks with nutritious alternatives for one week",
        "explanation": "Choosing healthy snacks provides essential nutrients and supports overall well-being.",
        "habit_id": "habit5",
        "created": "2023-06-05T18:00:00Z",
        "updated": "2023-06-05T19:15:00Z"
    },
    {
        "id": "challenge12",
        "name": "Nature Walk Challenge",
        "description": "Take a 30-minute walk in nature three times a week",
        "explanation": "Spending time in nature improves mental clarity, reduces stress, and boosts mood.",
        "habit_id": "habit2",
        "created": "2023-06-05T20:00:00Z",
        "updated": "2023-06-05T21:15:00Z"
    },
    {
        "id": "challenge13",
        "name": "Screen Time Reduction Challenge",
        "description": "Limit screen time to a maximum of two hours per day",
        "explanation": "Reducing screen time helps maintain a healthy balance and promotes better sleep.",
        "habit_id": "habit4",
        "created": "2023-06-05T22:00:00Z",
        "updated": "2023-06-05T23:15:00Z"
    },
    {
        "id": "challenge14",
        "name": "Random Acts of Kindness Challenge",
        "description": "Perform a random act of kindness for someone every day",
        "explanation": "Acts of kindness contribute to creating a positive impact on individuals and communities.",
        "habit_id": "habit3",
        "created": "2023-06-06T09:30:00Z",
        "updated": "2023-06-06T10:45:00Z"
    },
    {
        "id": "challenge15",
        "name": "No-Sugar Challenge",
        "description": "Avoid consuming added sugars for one month",
        "explanation": "Reducing sugar intake promotes better overall health and helps maintain stable energy levels.",
        "habit_id": "habit5",
        "created": "2023-06-06T11:00:00Z",
        "updated": "2023-06-06T12:20:00Z"
    },
    {
        "id": "challenge16",
        "name": "Journaling Challenge",
        "description": "Write in a journal for 10 minutes every day",
        "explanation": "Journaling helps clarify thoughts, relieve stress, and promote self-reflection.",
        "habit_id": "habit3",
        "created": "2023-06-06T12:30:00Z",
        "updated": "2023-06-06T13:40:00Z"
    },
    {
        "id": "challenge17",
        "name": "Early Morning Challenge",
        "description": "Wake up at 5 AM every day for a week",
        "explanation": "Waking up early can provide extra time for self-care, planning, and productivity.",
        "habit_id": "habit4",
        "created": "2023-06-06T14:00:00Z",
        "updated": "2023-06-06T15:15:00Z"
    },
    {
        "id": "challenge18",
        "name": "Home Cooking Challenge",
        "description": "Prepare a homemade meal for dinner five days in a row",
        "explanation": "Cooking at home allows for healthier food choices and fosters creativity in the kitchen.",
        "habit_id": "habit5",
        "created": "2023-06-06T16:00:00Z",
        "updated": "2023-06-06T17:15:00Z"
    },
    {
        "id": "challenge19",
        "name": "Breathing Exercise Challenge",
        "description": "Practice deep breathing exercises for 10 minutes every day",
        "explanation": "Deep breathing exercises help reduce stress, increase focus, and promote relaxation.",
        "habit_id": "habit4",
        "created": "2023-06-06T18:00:00Z",
        "updated": "2023-06-06T19:15:00Z"
    },
] as ChallengesRecord[]