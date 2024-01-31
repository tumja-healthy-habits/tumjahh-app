import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import LoginButton from "../authentication/LoginButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { globalStyles } from "src/styles";
import Colors from "constants/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SurveyParamList } from "./SurveyNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { RadioButton } from "react-native-paper";
import { NestableDraggableFlatList, NestableScrollContainer } from "react-native-draggable-flatlist";
import InputField from "components/authentication/InputField";
import { Ionicons } from '@expo/vector-icons';
import { UserRecord } from "types";

export default function InitialSurvey() {
    const { currentUser } = useAuthenticatedUser()
    const { goBack } = useNavigation<NavigationProp<SurveyParamList, "SurveyPopup">>()

    if (currentUser === null) {
        return <View />;
    }

    const [transport_bike_public, set_transport_bike_public] = useState<string>("");
    const [transport_walk, set_transport_walk] = useState<string>("bool");
    const [transport_means, set_transport_means] = useState<string[]>(["Walking", "Biking", "Public transport", "Car", "Others"]);
    const [transport_draggableColor, set_transport_draggableColor] = useState<string>("#FFF4EC");

    const [exercise_frequency, set_exercise_frequency] = useState<number>(NaN);
    const [exercise_ambition, set_exercise_ambition] = useState<string>("bool");
    const [exercise_satisfaction, set_exercise_satisfaction] = useState<string>("bool");
    const [exercise_sports, set_exercise_sports] = useState<string>("");

    const [diet_type, set_diet_type] = useState<string>("");
    const [diet_reasons, set_diet_reasons] = useState<string[]>(new Array());
    const [diet_criteria, set_diet_criteria] = useState<string[]>(new Array());

    const [sleep_hours, set_sleep_hours] = useState<number>(NaN);
    const [sleep_variance, set_sleep_variance] = useState<number>(NaN);
    const [sleep_peace, set_sleep_peace] = useState<string>("bool");

    const [mental_screentime, set_mental_screentime] = useState<number>(NaN);
    const [mental_thankfulness, set_mental_thankfulness] = useState<string>("bool");
    const [mental_stress, set_mental_stress] = useState<string>("bool");

    async function answer() {
        if (transport_bike_public == "" ||
            transport_walk == "bool" ||

            Number.isNaN(exercise_frequency) ||
            exercise_ambition == "bool" ||
            exercise_satisfaction == "bool" ||
            exercise_sports == "" ||

            diet_type == "" ||
            (["Vegetarian", "Vegan"].indexOf(diet_type) >= 0 && diet_reasons.length == 0) ||
            diet_criteria.length == 0 ||

            Number.isNaN(sleep_hours) ||
            Number.isNaN(sleep_variance) ||
            sleep_peace == "bool" ||

            Number.isNaN(mental_screentime) ||
            mental_thankfulness == "bool" ||
            mental_stress == "bool") {
            Alert.alert("Please reply to every question")
        } else {
            pb.collection("initial_survey").create({
                user: currentUser!.id,

                transport_bike_public: transport_bike_public,
                transport_walk: transport_walk == "Yes",
                transport_means: transport_means,

                exercise_frequency: exercise_frequency,
                exercise_ambition: exercise_ambition == "Yes",
                exercise_satisfaction: exercise_satisfaction == "Yes",
                exercise_sports: exercise_sports,

                diet_type: diet_type,
                diet_reasons: (["Vegetarian", "Vegan"].indexOf(diet_type) >= 0 ? diet_reasons : new Array()),
                diet_criteria: diet_criteria,

                sleep_hours: sleep_hours,
                sleep_variance: sleep_variance,
                sleep_peace: sleep_peace == "Yes",

                mental_screentime: mental_screentime,
                mental_thankfulness: mental_thankfulness == "Yes",
                mental_stress: mental_stress == "Yes",
            })

            const lastSurveyUpdate: FormData = new FormData(); lastSurveyUpdate.append("lastSurvey", currentUser!.created)
            pb.collection("users").update<UserRecord>(currentUser!.id, lastSurveyUpdate)

            goBack()
        }
    }

    return (
        <NestableScrollContainer contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[globalStyles.container, styles.outerContainer]}>
                <View style={{ width: "90%", marginVertical:"10%" }}>
                    <Text style={styles.title}>About yourself</Text>

                    <Text style={styles.sectionTitle}>Transportation</Text>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Whenever you could travel a distance by bike or public transport, which one would you rather choose?</Text>
                        {dropdown_question(set_transport_bike_public, transport_bike_public, transport_bike_public_options)}
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Do you enjoy going for a walk?</Text>
                        {yes_no_question(set_transport_walk, transport_walk)}
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Order the following means of transport by how commonly you use them</Text>
                        <GestureHandlerRootView>
                            <NestableDraggableFlatList
                                data={transport_means}
                                onDragEnd={(data) => set_transport_means(data.data)}
                                keyExtractor={(item) => item}
                                renderItem={({ item, drag, isActive }) => {
                                    return (
                                        <View style={[styles.radioButton, {
                                            flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 7,
                                            borderColor: isActive ? transport_draggableColor : "#FFF4EC"
                                        }]}>
                                            <Pressable style={{ flexDirection: 'row' }}
                                                onPressIn={drag}>
                                                <Ionicons name={"reorder-three-outline"} size={30} color="#666" style={{ alignSelf: "center", marginRight: 5 }} />
                                                <Text style={styles.questionText}>{item}</Text>
                                            </Pressable>
                                            <Text style={{ flex: 1, alignSelf: 'center', textAlign: 'right' }}>
                                                {!isActive ?
                                                    (transport_means.indexOf(item) == 0 ? "(most common)" :
                                                        (transport_means.indexOf(item) == transport_means.length - 1 ?
                                                            "(least common)" : "")) : ""}
                                            </Text>
                                        </View>
                                    )
                                }}>

                            </NestableDraggableFlatList>
                        </GestureHandlerRootView>
                    </View>

                    <Text style={styles.sectionTitle}>Exercise</Text>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>How often do you exercise per week?</Text>
                        <InputField
                            value={Number.isNaN(exercise_frequency) ? "" : exercise_frequency.toString()}
                            label={"Frequency in times/week"}
                            keyboardType='numeric'
                            onChangeText={(value) => set_exercise_frequency(parseInt(value))}
                            additionalProps={{ marginBottom: 0 }}
                        />
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Would you want to be more active in your daily life?</Text>
                        {yes_no_question(set_exercise_ambition, exercise_ambition)}
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Do you feel happy with your body?</Text>
                        {yes_no_question(set_exercise_satisfaction, exercise_satisfaction)}
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>What ḱind of sports do you practice?</Text>
                        <InputField
                            value={exercise_sports}
                            label={"e.g. running, football, dance, ..."}
                            onChangeText={(value) => set_exercise_sports(value)}
                            additionalProps={{ marginBottom: 0 }}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Nutrition</Text>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>What is your primary diet?</Text>
                        {dropdown_question(set_diet_type, diet_type, diet_type_options)}
                    </View>

                    {["Vegetarian", "Vegan"].indexOf(diet_type) >= 0 &&
                        <View style={styles.questionBlock}>
                            <Text style={styles.questionText}>What are your main reasons for a v{diet_type.substring(1)} diet?</Text>
                            {dropdown_multi_question(set_diet_reasons, diet_reasons, diet_reasons_options)}
                        </View>
                    }

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>What do you pay attention to when buying groceries?</Text>
                        {dropdown_multi_question(set_diet_criteria, diet_criteria, diet_criteria_options)}
                    </View>

                    <Text style={styles.sectionTitle}>Sleeping habits</Text>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>How many hours do you sleep on average per night?</Text>
                        <InputField
                            value={Number.isNaN(sleep_hours) ? "" : sleep_hours.toString()}
                            label={"Amount in hours/day"}
                            keyboardType='numeric'
                            onChangeText={(value) => set_sleep_hours(parseInt(value))}
                            additionalProps={{ marginBottom: 0 }}
                        />
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>By how many hours does your bedtime vary throughout the week (i.e. between weekdays and weekend)?</Text>
                        <InputField
                            value={Number.isNaN(sleep_variance) ? "" : sleep_variance.toString()}
                            label={"Amount in hours/day"}
                            keyboardType='numeric'
                            onChangeText={(value) => set_sleep_variance(parseInt(value))}
                            additionalProps={{ marginBottom: 0 }}
                        />
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Do you feel it is hard shutting off after you wanted to finish your work at the end of the day?</Text>
                        {yes_no_question(set_sleep_peace, sleep_peace)}
                    </View>

                    <Text style={styles.sectionTitle}>Mental health</Text>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>What is your average daily screen time on your phone?</Text>
                        <InputField
                            value={Number.isNaN(mental_screentime) ? "" : mental_screentime.toString()}
                            label={"Amount in hours/day"}
                            keyboardType='numeric'
                            onChangeText={(value) => set_mental_screentime(parseInt(value))}
                            additionalProps={{ marginBottom: 0 }}
                        />
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Do you feel thankful for the positive aspects in life lately?</Text>
                        {yes_no_question(set_mental_thankfulness, mental_thankfulness)}
                    </View>

                    <View style={styles.questionBlock}>
                        <Text style={styles.questionText}>Do you feel stressed by other peoples achievements?</Text>
                        {yes_no_question(set_mental_stress, mental_stress)}
                    </View>

                    <View style={styles.title}>
                        <LoginButton label={"Done"} onPress={(answer)} />
                    </View>
                </View >
            </View >
        </NestableScrollContainer >
    )
}

const transport_bike_public_options = [{ o: 'Bike' }, { o: 'Public transport' }, { o: 'Depends' }, { o: 'Neither' }];

const diet_type_options = [{ o: 'Omnivore' }, { o: 'Vegetarian' }, { o: 'Vegan' }, { o: 'Others' }]

const diet_reasons_options = [{ o: 'Sustainability' }, { o: 'Animal cruelty' }, { o: 'Health' }, { o: 'Taste' }, { o: 'Others' }]

const diet_criteria_options = [{ o: 'Local food' }, { o: 'Organic food' }, { o: 'Ingridients' }, { o: 'Others' }]

function dropdown_question(setter: React.Dispatch<React.SetStateAction<any>>, state: any, options: { 'o': string }[]) {
    return (
        <Dropdown
            style={styles.dropdown}
            maxHeight={300}
            containerStyle={{ borderRadius: 8 }}
            placeholderStyle={styles.questionTextDropdown}
            placeholder={'Please select an answer'}
            selectedTextStyle={styles.questionTextDropdown}
            data={options}
            labelField='o'
            valueField='o'
            value={state}
            onChange={(item) => setter(item.o)}
        />
    )
}

function yes_no_question(setter: React.Dispatch<React.SetStateAction<any>>, state: any) {
    return (
        <RadioButton.Group
            onValueChange={(value) => setter(value)}
            value={state}
        >
            <RadioButton.Item label="Yes" value="Yes"
                style={styles.radioButton}
                color='#FFF4EC' />
            <RadioButton.Item label="No" value="No"
                style={styles.radioButton}
                color='#FFF4EC' />
        </RadioButton.Group>
    )
}

function dropdown_multi_question(setter: React.Dispatch<React.SetStateAction<any>>, state: any, options: { 'o': string }[]) {
    return (
        <MultiSelect
            style={styles.dropdown}
            maxHeight={300}
            containerStyle={{ borderRadius: 8 }}
            placeholderStyle={styles.questionTextDropdown}
            placeholder={state.length == 0 ? 'Please select all answers that apply' : state.join(", ")}
            selectedTextStyle={styles.questionTextDropdown}
            data={options}
            labelField='o'
            valueField='o'
            value={state}
            onChange={(item) => setter(item)}
            activeColor={Colors.pastelViolet}
            visibleSelectedItem={false}
        />
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#d7c3de',
    },
    title: {
        color: '#FFF4EC',
        fontSize: 30,
        marginVertical: 15,
    },
    sectionTitle: {
        color: '#FFF4EC',
        fontSize: 20,
        marginVertical: 10,
    },
    questionBlock: {
        marginBottom: 20,
    },
    questionText: {
        fontSize: 16,
        marginVertical: 10,
    },
    questionTextDropdown: {
        fontSize: 16,
    },
    dropdown: {
        borderColor: '#FFF4EC',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
    },
    radioButton: {
        borderColor: '#FFF4EC',
        borderRadius: 8,
        borderWidth: 1,
        marginVertical: 5,
        paddingVertical: 0,
        paddingLeft: 7,
        paddingRight: 0,
    }
})
