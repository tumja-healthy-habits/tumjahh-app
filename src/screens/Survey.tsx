import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import CustomButton from "../components/authentication/CustomButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { UserRecord } from "types";
import { Record } from "pocketbase";
import { globalStyles } from "src/styles";
import Colors from "constants/colors";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SurveyParamList } from "components/misc/SurveyNavigator";
import ChallengeCard from "components/challenges/ChallengeCard";

export default function Survey() {
    const { currentUser } = useAuthenticatedUser()
    const { params } = useRoute<RouteProp<SurveyParamList, "Survey">>()
    const { setParams } = useNavigation<NavigationProp<SurveyParamList, "Survey">>()
    const challenges = [{name : "Hydration Challenge",}]
    console.log(challenges[0].name)

    if (currentUser === null) {
        return <View />;
    }

    const [currentPage, setPage] = useState<number>(0)

    useEffect(() => {
         
    }, [])

    async function fillSurvey() {
        const newDate = (new Date()).toISOString()
        const lastSurveyUpdate: FormData = new FormData(); lastSurveyUpdate.append("lastSurvey", newDate)
        pb.collection("users").update<UserRecord>(currentUser!.id, lastSurveyUpdate)
    }

    return (
        
        <View style={[globalStyles.container, styles.outerContainer]}>
            <View style={{ width: "90%" }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.formTitle}>The "{challenges[currentPage].name}" challenge is something I do ...</Text>
                </View>



                <CustomButton label={currentPage == params.challenges.length ? "Done" : "Next"} onPress={fillSurvey} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#d7c3de',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    formTitle: {
        color: Colors.accent,
        fontSize: 30,
        margin: 15,
        marginBottom: 20,
        alignSelf: "flex-end",
    },
})