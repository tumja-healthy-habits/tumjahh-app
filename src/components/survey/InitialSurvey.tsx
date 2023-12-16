import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import CustomButton from "../authentication/CustomButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles } from "src/styles";
import Colors from "constants/colors";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SurveyParamList } from "./SurveyNavigator";
import Slider from "@react-native-community/slider";
import { ScrollView } from "react-native-gesture-handler";
import { UserRecord } from "types";

export default function InitialSurvey() {
    const { currentUser } = useAuthenticatedUser()
    const { goBack } = useNavigation<NavigationProp<SurveyParamList, "SurveyPopup">>()

    if (currentUser === null) {
        return <View />;
    }

    const [transport_bike_public, set_transport_bike_public] = useState<string>();
    const [transport_walk, set_transport_walk] = useState<boolean>();
    const [transport_means, set_transport_means] = useState<string>();

    const [exercise_frequency, set_exercise_frequency] = useState<number>();
    const [exercise_ambition, set_exercise_ambition] = useState<boolean>();
    const [exercise_satisfaction, set_exercise_satisfaction] = useState<boolean>();
    const [exercise_sports, set_exercise_sports] = useState<string>();

    const [diet_type, set_diet_type] = useState<string>();
    const [diet_reasons, set_diet_reasons] = useState<string[]>();
    const [diet_criteria, set_diet_criteria] = useState<string[]>();

    const [sleep_hours, set_sleep_hours] = useState<number>();
    const [sleep_variance, set_sleep_variance] = useState<number>();
    const [sleep_peace, set_sleep_peace] = useState<boolean>();

    const [mental_screentime, set_mental_screentime] = useState<number>();
    const [mental_thankfulness, set_mental_thankfulness] = useState<boolean>();
    const [mental_stress, set_mental_stress] = useState<boolean>();

    async function answer() {
        pb.collection("initial_survey").create({
            user: currentUser!.id,

            transport_bike_public: transport_bike_public,
            transport_walk: transport_walk,
            transport_means: transport_means,

            exercise_frequency: exercise_frequency,
            exercise_ambition: exercise_ambition,
            exercise_satisfaction: exercise_satisfaction,
            exercise_sports: exercise_sports,

            diet_type: diet_type,
            diet_reasons: diet_reasons,
            diet_criteria: diet_criteria,

            sleep_hours: sleep_hours,
            sleep_variance: sleep_variance,
            sleep_peace: sleep_peace,

            mental_screentime: mental_screentime,
            mental_thankfulness: mental_thankfulness,
            mental_stress: mental_stress,
        })
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[globalStyles.container, styles.outerContainer]}>
                <View style={{ width: "90%" }}>
                    <Text style={styles.formTitle}>About youself</Text>

                    <Text style={styles.questionTitle}>Transportation</Text>
                    <Text>Whenever you could travel a distance by bike or public transport, which one would you rather choose?</Text>
                    <Text>Do you enjoy going for a walk?</Text>
                    <Text>What is your most common means of transport?</Text>

                    <Text style={styles.questionTitle}>Exercise</Text>
                    <Text>How often do you exercise per week?</Text>
                    <Text>Would you want to be more active in your daily life?/Are you happy with the amount of sports you do?</Text>
                    <Text>Do you feel happy with your body?</Text>
                    <Text>What ḱind of sports do you practice?</Text>

                    <Text style={styles.questionTitle}>Nutrition</Text>
                    <Text>What is your primary diet?</Text>
                    <Text>If you eat vegetarian/vegan what are your main reasons for it?</Text>
                    <Text>When you buy groceries do you pay attention to</Text>

                    <Text style={styles.questionTitle}>Sleeping habits</Text>
                    <Text>How many hours do you sleep on average per night?</Text>
                    <Text>By how many hours does your bedtime vary throughout the week (i.e. between weekdays and weekend)?</Text>
                    <Text>Do you feel it is hard shutting of after you wanted to finish your work at the end of the day?</Text>

                    <Text style={styles.questionTitle}>Mental health</Text>
                    <Text>What is your average daily screen time on your phone?</Text>
                    <Text>Do you feel thankful for the positive aspects in life lately?</Text>
                    <Text>Do you feel stressed by other peoples achievements?</Text>

                    <CustomButton label={"Done"} onPress={(answer)} />
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
        marginVertical: 15,
    },
})