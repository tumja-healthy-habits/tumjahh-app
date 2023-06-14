import ChallengeSelectionForm, { VAR_CHALLENGES } from "components/ChallengeSelectionModal";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Button, FlatList, Modal, SafeAreaView, ListRenderItemInfo } from "react-native";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserContext";
import { styles } from "src/styles";
import { LocalStorageChallengeEntry } from "types";
import ActionButton from "components/ActionButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HomeStackNavigatorParamList } from "./HomeScreen";

export default function DailyChallengesScreen() {
    const [challenges, setChallenges] = useState<LocalStorageChallengeEntry[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const { currentUser } = useAuthenticatedUser()
    const navigation = useNavigation<NavigationProp<HomeStackNavigatorParamList, "Challenges">>()

    // get the selected challenges from local storage
    useEffect(() => {
        AsyncStorage.getItem(VAR_CHALLENGES).then((jsonString: string | null) => {
            if (jsonString === null) return
            const challenges: LocalStorageChallengeEntry[] = JSON.parse(jsonString)
            setChallenges(challenges)
        })
    }, [])

    if (currentUser === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.textfieldTitle}>You need to be logged in to use this feature</Text>
            </View>
        )
    }

    function renderChallenge({ item }: ListRenderItemInfo<LocalStorageChallengeEntry>) {
        return <ActionButton
            title={item.record.name}
            onPress={() => navigation.navigate('Take Photo', {
                challengeName: item.record.name,
            })}
            color={Colors.white}
            textColor={Colors.anotherPeachColor}
            pressedColor={Colors.anotherPeachColor}
            textPressedColor={Colors.white}
        />
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors.pastelViolet, paddingTop: 10 }]}>
            <Text style={styles.textfieldTitle}>Hi, {currentUser.name}.</Text>
            {challenges.length === 0 ? <Button title="Select some challenges here :)" onPress={() => setShowModal(true)} color={Colors.accent} />
                : <>
                    <FlatList
                        data={challenges}
                        keyExtractor={({ record }, index) => record.id + index}
                        renderItem={renderChallenge}
                    />
                </>}
            <Modal
                animationType="slide"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <ChallengeSelectionForm onSubmit={(records: LocalStorageChallengeEntry[]) => {
                        setShowModal(false)
                        setChallenges(records)
                    }} />
                </SafeAreaView>
            </Modal>
        </View>
    )
}