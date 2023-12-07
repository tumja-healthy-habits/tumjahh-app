import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import BlurModal from "../misc/BlurModal";
import CustomButton from "../authentication/CustomButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SurveyParamList } from "./SurveyNavigator";
import { Record } from "pocketbase";

export default function SurveyPopup() {
    const { currentUser } = useAuthenticatedUser()
    const { navigate } = useNavigation<NavigationProp<SurveyParamList, "SurveyPopup">>()

    if (currentUser === null) {
        return <View />;
    }

    const [daysSinceLastSurvey, setDaysSinceLastSurvey] = useState<number>(20)
    const [dismissed, setDismissed] = useState<boolean>(false)

    async function updateDaysSinceLastSurvey(date: string) {
        setDaysSinceLastSurvey(Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)))
    }

    useEffect(() => {
        if (currentUser.lastSurvey === "") {
            updateDaysSinceLastSurvey(currentUser.created)
        } else {
            updateDaysSinceLastSurvey(currentUser.lastSurvey)
        }
    }, [])

    async function fillSurvey() {
        const challenges: Record[] = (await pb.collection("user_challenges").getFullList({
            filter: `user_id = "${currentUser!.id}"`
        }))
        navigate("Survey", { challenges: challenges })

        // // updating lastSurvey
        // const newDate = (new Date()).toISOString()
        // const lastSurveyUpdate: FormData = new FormData(); lastSurveyUpdate.append("lastSurvey", newDate)
        // pb.collection("users").update<UserRecord>(currentUser!.id, lastSurveyUpdate)
        // updateDaysSinceLastSurvey(newDate)
    }

    return (
        <BlurModal visible={!dismissed && daysSinceLastSurvey >= 14} onClose={() => setDismissed(true)}>
            <View style={styles.modalContainer} >
                <Text style={styles.modalText}>Did you know the BeHealthy App was created as part of a research project about habit formation?
                    Help us to collect meaningful data by regularly filling out this survey about the habits you formed by using BeHealthy.
                    Don't worry! Your data will be saved anonymously and not used for any purpose but our research.
                    This survey is due since: {daysSinceLastSurvey - 14} days</Text>
                <CustomButton label="Fill out now!" onPress={fillSurvey} />
                <CustomButton label="Remind me later" onPress={() => setDismissed(true)} />
            </View>
        </BlurModal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#d7c3de',
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    }
})