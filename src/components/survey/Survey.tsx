import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import LoginButton from "../authentication/LoginButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles } from "src/styles";
import Colors from "constants/colors";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SurveyParamList } from "./SurveyNavigator";
import Slider from "@react-native-community/slider";
import { ScrollView } from "react-native-gesture-handler";
import { UserRecord } from "types";

export default function Survey() {
    const { currentUser } = useAuthenticatedUser()
    const { params } = useRoute<RouteProp<SurveyParamList, "Survey">>()
    const { navigate } = useNavigation<NavigationProp<SurveyParamList, "Survey">>()

    if (currentUser === null) {
        return <View />;
    }

    const [currentPage, setPage] = useState<number>(0)
    const questions = ["... automatically", "... without having to consciously remember", "... before I realize I'm doing them", "... without thinking"];
    const answers: { get: number, set: React.Dispatch<React.SetStateAction<number>> }[] = new Array(4);
    for (var i = 0; i < answers.length; i++) {
        const [answer, setAnswer] = useState<number>(1)
        answers[i] = { get: answer, set: setAnswer }
    }
    const [allAnswers, setAllAnswers] = useState<number[][]>(new Array())

    console.log(params.categories)
    console.log("answers: ", answers)

    async function answerChallenge() {
        allAnswers.push(answers.map(a => a.get))
        console.log(allAnswers)
        for (var i = 0; i < answers.length; i++) {
            answers[i].set(1)
        }
        if (currentPage == params.categories.length - 1) {
            for (var i = 0; i < allAnswers.length; i++) {
                const record = await pb.collection("survey_answers").create({
                    user: currentUser!.id,
                    category: params.categories[i],
                    answer1: allAnswers[i][0],
                    answer2: allAnswers[i][1],
                    answer3: allAnswers[i][2],
                    answer4: allAnswers[i][3],
                })
                console.log(record)
            }


            console.log("after creation")

            const lastSurveyUpdate: FormData = new FormData(); lastSurveyUpdate.append("lastSurvey", (new Date()).toISOString())
            pb.collection("users").update<UserRecord>(currentUser!.id, lastSurveyUpdate)

            navigate("SurveyResults", { categories: params.categories })
        } else {
            setPage(currentPage + 1)
        }
    }

    return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[globalStyles.container, styles.outerContainer]}>
                    <View style={{ width: "90%" }}>
                        <Text style={styles.formTitle}>I am doing the challenges of category "{params.categories[currentPage]}" ...</Text>

                        {[...Array(questions.length).keys()].map((n) =>
                            <View>
                                <Text style={styles.questionTitle}>{questions[n]}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ width: '40%', textAlign: 'left' }}>Completely disagree</Text>
                                    <Text style={{ width: '10%', textAlign: 'center' }}>{answers[n].get}</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>Completely agree</Text>
                                </View>
                                <Slider style={{ marginBottom: 20 }} value={answers[n].get} minimumValue={1} maximumValue={10} step={1} minimumTrackTintColor={Colors.pastelGreen} thumbTintColor={Colors.pastelGreen}
                                    onValueChange={(v) => answers[n].set(v)} />
                            </View>
                        )}

                        <LoginButton label={currentPage == params.categories.length - 1 ? "See results" : "Next"} onPress={answerChallenge} spacing={styles.buttonSpacing}/>
                    </View>
                </View>
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#d7c3de',
    },
    formTitle: {
        color: Colors.accent,
        fontSize: 30,
        margin: 15,
        marginBottom: 20,
    },
    questionTitle: {
        color: Colors.accent,
        fontSize: 20,
        margin: 15,
    },
    buttonSpacing: {
        marginVertical: 10
    }
})