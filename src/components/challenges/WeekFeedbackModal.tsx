import { useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { createWeeklyChallengeRecord } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { useWeeklyChallenges } from "src/store/WeeklyChallengesProvider";
import { WeeklyChallengesRecord } from "types";

type WeekFeedbackModalProps = {
}

export default function WeekFeedbackModal({ }: WeekFeedbackModalProps) {
    const { currentUser } = useAuthenticatedUser()
    const weeklyChallenges: WeeklyChallengesRecord[] = useWeeklyChallenges()
    const [showModal, setShowModal] = useState<boolean>(false)

    useEffect(() => {
        console.log("useEffect in feedback modal, weekly challenges", weeklyChallenges)
        if (weeklyChallenges.length === 0) return
        if (currentUser === null) return
        const today: Date = new Date()
        const startDate: Date = new Date(weeklyChallenges[0].start_date)
        console.log("today", today, "start date", startDate, "diff", today.getUTCDate() - startDate.getUTCDate())
        if (today.getUTCDate() - startDate.getUTCDate() >= 7) {
            setShowModal(true)
            Promise.all(weeklyChallenges.map(
                (weeklyChallenge: WeeklyChallengesRecord) => createWeeklyChallengeRecord(weeklyChallenge.expand.challenge_id.id, currentUser.id)))
        }
    }, [])

    return <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
        <View style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",

        }}>
            <Text>WeekFeedbackModal</Text>
            <Button onPress={() => setShowModal(false)}>Close</Button>
        </View>
    </Modal>
}