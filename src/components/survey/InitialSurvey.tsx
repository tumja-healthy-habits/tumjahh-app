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

    async function answer() {
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[globalStyles.container, styles.outerContainer]}>
                <View style={{ width: "90%" }}>
                    <Text style={styles.formTitle}>About youself</Text>

                    <Text style={styles.questionTitle}>Transportation</Text>


                    <Text style={styles.questionTitle}>Exercise</Text>


                    <Text style={styles.questionTitle}>Nutrition</Text>


                    <Text style={styles.questionTitle}>Sleeping habits</Text>


                    <Text style={styles.questionTitle}>Mental health</Text>


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