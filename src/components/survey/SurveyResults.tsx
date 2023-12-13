import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import CustomButton from "../authentication/CustomButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { SurveyAnswerRecord, UserRecord } from "types";
import { globalStyles } from "src/styles";
import Colors from "constants/colors";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SurveyParamList } from "components/survey/SurveyNavigator";
import { LineChart, YAxis, Grid } from "react-native-svg-charts";
import { ScrollView } from "react-native-gesture-handler";
import { Circle, Svg } from "react-native-svg";

export default function SurveyResults() {
    const { currentUser } = useAuthenticatedUser()
    const { params } = useRoute<RouteProp<SurveyParamList, "SurveyResults">>()
    const { navigate } = useNavigation<NavigationProp<SurveyParamList, "SurveyResults">>()

    if (currentUser === null) {
        return <View />;
    }

    const [allAnswers, setAllAnswers] = useState<number[][][]>(new Array())

    useEffect(() => {
        for (var i = 0; i < params.challenges.length; i++) {
            pb.collection("survey_answers").getFullList<SurveyAnswerRecord>({
                filter: `user = "${currentUser.id}" && challenge = "${params.challenges[i].id}"`,
                sort: '+created'
            }).then(answer => allAnswers.push(
                answer.map(a => [a.answer1, a.answer2, a.answer3, a.answer4])
            ))
        }
    }, [])

    const colors = [Colors.pastelGreen, Colors.pastelOrange, Colors.pastelOrangeDribble, Colors.pastelViolet]
    const questions = ["... automatically", "... without having to consciously remember", "... before you realize you're doing it", "... without thinking"];

    const insetTB = { top: 10, bottom: 10 }
    const svg = { fontSize: 12, fill: 'grey' }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[globalStyles.container, styles.outerContainer]}>
                <View style={{ width: '90%' }}>
                    <Text style={styles.formTitle}>Your progress</Text>

                    {[...Array(params.challenges.length).keys()].map((i) =>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.questionTitle}>Your progress in doing the "{params.challenges[i].name}" challenge ...</Text>
                            <View style={{ height: 200, flexDirection: 'row', marginBottom: 10 }}>
                                <YAxis
                                    data={[1, 10]}
                                    contentInset={insetTB}
                                    svg={svg}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    {allAnswers[i] != undefined ?
                                        <LineChart
                                            style={{ flex: 1 }}
                                            data={
                                                allAnswers[i][0].map((_, colIndex) => {
                                                    return {
                                                        data: allAnswers[i].map(row => row[colIndex]),
                                                        svg: { stroke: colors[colIndex] }
                                                    }
                                                })}
                                            contentInset={insetTB}
                                        >
                                            <Grid />
                                        </LineChart> :
                                        <Text>Loading your data...</Text>}
                                </View>
                            </View>
                            {[...Array(questions.length).keys()].map((i) =>
                                <View style={{ marginLeft: 20, flexDirection: 'row' }}>
                                    <Svg width={20}><Circle cx='5' cy='10' r='5' fill={colors[i]} /></Svg>
                                    <Text>{questions[i]}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <Text></Text>
                    <CustomButton label={"Done"} onPress={() => navigate("SurveyPopup")} />
                </View>
            </View>
        </ScrollView >
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
})