import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { pb } from "src/pocketbaseService";
import BlurModal from "../misc/BlurModal";
import CustomButton from "../authentication/CustomButton";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";

export const VAR_LASTSURVEY: string = "LastSurveyDate"
// export const VAR_REMINDINXDAYS: string = "RemindInXDaysDate"
// export const x: number = 1

export default function SurveyPopup() {
    const { currentUser } = useAuthenticatedUser()
    const [daysSinceLastSurvey, setDaysSinceLastSurvey] = useState<number>(0)
    // const [daysSinceRemindInXDays, setDaysSinceRemindInXDays] = useState<number>(0)
    const [dismissed, setDismissed] = useState<boolean>(false)

    // AsyncStorage.setItem(VAR_LASTSURVEY, "2023-11-1");
    // setDismissed(false)
    async function updateDaysSince_(updateFunction: (value: React.SetStateAction<number>) => void, date: string){
        updateFunction(Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)))
    }
    AsyncStorage.getItem(VAR_LASTSURVEY).then((lastSurvey: string | null) => {
        if (lastSurvey !== null) {
            updateDaysSince_(setDaysSinceLastSurvey, lastSurvey)
        }
    });
    // AsyncStorage.getItem(VAR_REMINDINXDAYS).then((remindInXDays: string | null) => {
    //     if (remindInXDays !== null) {
    //         updateDaysSince_(setDaysSinceRemindInXDays, remindInXDays)
    //     }
    // });

    async function fillSurvey(){
        pb.collection("survey_answers").create({
            user: currentUser?.id
        })
        const newDate = new Date().toDateString()
        AsyncStorage.setItem(VAR_LASTSURVEY, newDate)
        updateDaysSince_(setDaysSinceLastSurvey, newDate)
    }

    return (
        <BlurModal visible={!dismissed && daysSinceLastSurvey >= 14 /*&& daysSinceRemindInXDays >= x*/} onClose={() => setDismissed(true)}>
            <View style={styles.modalContainer} >
                <Text style={styles.modalText}>Did you know the BeHealthy App was created as part of a research project about habit formation?
                    Help us to collect meaningful data by regularly filling out this survey about the habits you formed by using BeHealthy.
                    Don't worry! Your data will be saved anonymously and not used for any purpose but our research.
                    Last survey you filled out: {daysSinceLastSurvey} ago</Text>
                <CustomButton label="Fill out now!" onPress={fillSurvey} />
                <CustomButton label="Remind me later" onPress={() => setDismissed(true)} />
                {/* <CustomButton label="Remind me in X days" onPress={() => {
                    const remindInXDays: string = new Date().toDateString()
                    AsyncStorage.setItem(VAR_REMINDINXDAYS, remindInXDays)
                    updateDaysSince_(setDaysSinceRemindInXDays, remindInXDays)
                    }} /> */}
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