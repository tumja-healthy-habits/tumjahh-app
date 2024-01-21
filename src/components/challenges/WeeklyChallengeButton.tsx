import Colors from "constants/colors";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ProgressBar } from "react-native-paper";
import { ChallengesRecord, WeeklyChallengesRecord } from "types";

const OPEN_CAMERA_DELAY: number = 300 // in milliseconds

type weeklyChallengeProps = {
    weeklyChallenge: WeeklyChallengesRecord,
    openCamera: () => void,
}

export default function WeeklyChallengeButton({ weeklyChallenge, openCamera }: weeklyChallengeProps) {
    const [tickedOff, setTickedOff] = useState<boolean>(new Date(weeklyChallenge.last_completed).getDay() == new Date().getDay())

    const challenge: ChallengesRecord = weeklyChallenge.expand.challenge_id

    function tickOffChallenge(): void {
        setTimeout(() => openCamera(), OPEN_CAMERA_DELAY)
    }

    function handleClickCheckbox(pressed: boolean): void {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setTickedOff(pressed)
        if (pressed) tickOffChallenge()
    }

    return (<View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={[styles.outerContainer, { flexDirection: "row" }]}>
            {/* <View style={styles.nameAndButtonsContainer}>
                <Text style={styles.buttonText}>
                    {challenge.name}
                </Text>
                <BouncyCheckbox
                    size={40}
                    iconImageStyle={{
                        width: 20,
                        height: 20,
                    }}
                    onPress={handleClickCheckbox}
                    fillColor={Colors.anotherPeachColor}
                    isChecked={tickedOff}
                    disabled={tickedOff}
                    style={styles.checkbox} />
            </View>
            <View style={styles.progressContainer}>
                <ProgressBar progress={weeklyChallenge.amount_planned === 0 ? 1 : Math.min(weeklyChallenge.amount_accomplished / weeklyChallenge.amount_planned)} color={Colors.anotherPeachColor} style={styles.progressBar} />
                <Text style={styles.buttonText}>{weeklyChallenge.amount_accomplished}/{weeklyChallenge.amount_planned}</Text>
            </View> */}
            <View style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={styles.buttonText}>
                    {challenge.name}
                </Text>
                <ProgressBar progress={weeklyChallenge.amount_planned === 0 ? 1 : Math.min(weeklyChallenge.amount_accomplished / weeklyChallenge.amount_planned)} color={Colors.anotherPeachColor} style={styles.progressBar} />
            </View>
            <View style={{ justifyContent: "space-between", alignItems: "center" }}>
                <BouncyCheckbox
                    size={40}
                    iconImageStyle={{
                        width: 20,
                        height: 20,
                    }}
                    onPress={handleClickCheckbox}
                    fillColor={Colors.anotherPeachColor}
                    isChecked={tickedOff}
                    disabled={tickedOff}
                    style={styles.checkbox} />
                <Text style={[styles.buttonText, { marginTop: 10, bottom: -12 }]}>{weeklyChallenge.amount_accomplished}/{weeklyChallenge.amount_planned}</Text>
            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        borderRadius: 10,
        margin: 10,
        padding: 25,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: Colors.white,
        overflow: "hidden",
        flexDirection: "column",
    },
    nameAndButtonsContainer: {
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonText: {
        fontSize: 28,
        textAlign: "center",
        color: Colors.anotherPeachColor,
    },
    icon: {
        fontSize: 34,
    },
    progressBar: {
        height: 5,
        borderRadius: 5,
        marginRight: 15,
        width: Dimensions.get("window").width * 0.65,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    checkbox: {
        left: 8,
    }
})