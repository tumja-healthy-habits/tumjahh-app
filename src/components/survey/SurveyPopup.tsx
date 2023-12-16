import { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import BlurModal from "../misc/BlurModal";
import CustomButton from "../authentication/CustomButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SurveyParamList } from "./SurveyNavigator";
import { ChallengesRecord, UserRecord } from "types";
import Colors from "constants/colors";

const surveyInterval: number = 14

export default function SurveyPopup() {
    const { currentUser } = useAuthenticatedUser()
    const { navigate } = useNavigation<NavigationProp<SurveyParamList, "SurveyPopup">>()

    if (currentUser === null) {
        return <View />;
    }

    const [daysSinceLastSurvey, setDaysSinceLastSurvey] = useState<number>(0)
    const [dismissed, setDismissed] = useState<number>(0)

    async function updateDaysSinceLastSurvey(date: string) {
        setDaysSinceLastSurvey(Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)))
    }

    useEffect(() => { updateDaysSinceLastSurvey(currentUser.lastSurvey != "" ? currentUser.lastSurvey : currentUser.created) }, [])

    async function fillSurvey() {
        const challenges: { id: string, name: string }[] = (await pb.collection("user_challenges").getFullList<ChallengesRecord>({
            filter: `user_id = "${currentUser!.id}"`,
            expand: `challenge_id`
        }))[0].expand.challenge_id.map((e: ChallengesRecord) => { return { id: e.id, name: e.name } })
        navigate("Survey", { challenges: challenges })
        setDismissed(2)
    }

    return (<BlurModal visible={dismissed < 2 && (daysSinceLastSurvey >= surveyInterval || currentUser.lastSurvey == "")}
        onClose={() => setDismissed(dismissed == 0 && currentUser.lastSurvey == "" ? 1 : 2)}>
        <View style={styles.modalContainer} >
            {dismissed == 0 && currentUser.lastSurvey == "" ?
                <View>
                    <Text style={styles.modalText}>
                        {"Did you know the BeHealthy App was created as part of a research project about habit formation?\n" +
                            "Help us to collect meaningful data by telling us a little bit more about yourself.\n" +
                            "This will also help you track your progress and achievements!\n" +
                            "Don't worry! Your data will be saved anonymously and not used for any purpose other than our research."}
                    </Text>
                    <CustomButton label="Fill out now!"
                        onPress={() => {
                            navigate("InitialSurvey")
                            setDismissed(2)
                        }} />
                    <CustomButton label="Remind me later" onPress={() => setDismissed(1)} />
                    <CustomButton label="No, thank you"
                        onPress={() => {
                            const lastSurveyUpdate: FormData = new FormData(); lastSurveyUpdate.append("lastSurvey", currentUser.created)
                            pb.collection("users").update<UserRecord>(currentUser.id, lastSurveyUpdate)
                        }} />
                </View>
                :
                <View>
                    <Text style={styles.modalText}>
                        {"Did you know the BeHealthy App was created as part of a research project about habit formation?\n" +
                            "Help us and yourself to track your progress and achievements by regularly filling out this survey about the habits you formed by using BeHealthy.\n" +
                            "Don't worry! Your data will be saved anonymously and not used for any purpose other than our research.\n\n" +
                            "This survey is due since: " + (daysSinceLastSurvey - surveyInterval) + " days"}
                    </Text>
                    <CustomButton label="Fill out now!" onPress={fillSurvey} />
                    <CustomButton label="Remind me later" onPress={() => setDismissed(2)} />
                </View>}
            <Text>{"If you want to find out more regarding our research project, feel free to reach out to us via "}
                <Text style={{ color: Colors.pastelViolet }} onPress={() => Linking.openURL('mailto:habits@ja.tum.de')}>habits@ja.tum.de</Text>.
            </Text>
        </View>
    </BlurModal >)
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
        fontSize: 16,
    }
})