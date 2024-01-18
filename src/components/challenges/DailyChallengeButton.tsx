import { Ionicons } from "@expo/vector-icons";
import Colors from "constants/colors";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    const [showCameraIcon, setShowCameraIcon] = useState<boolean>(false)

    const challenge: ChallengesRecord = weeklyChallenge.expand.challenge_id

    function tickOffChallenge(): void {
        setTimeout(() => openCamera(), OPEN_CAMERA_DELAY)
        setTimeout(() => setShowCameraIcon(true), OPEN_CAMERA_DELAY + 1000)
    }

    function handleClickCheckbox(pressed: boolean): void {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setTickedOff(pressed)
        if (pressed) tickOffChallenge()
    }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.nameAndButtonsContainer}>
                <Text style={styles.buttonText}>
                    {challenge.name}
                </Text>
                <View style={styles.rightContainer}>
                    <BouncyCheckbox
                        size={35}
                        onPress={handleClickCheckbox}
                        fillColor={Colors.anotherPeachColor}
                        isChecked={tickedOff}
                        disabled={tickedOff} />
                    {showCameraIcon && <Ionicons style={styles.icon} name="camera-outline" color={Colors.black} />}
                </View>
            </View>
            <View style={styles.progressContainer}>
                <ProgressBar progress={Math.min(weeklyChallenge.amount_accomplished / weeklyChallenge.amount_planned)} color={Colors.anotherPeachColor} style={styles.progressBar} />
                <Text style={styles.buttonText}>{weeklyChallenge.amount_accomplished}/{weeklyChallenge.amount_planned}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        borderRadius: 10,
        margin: 15,
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
        fontSize: 23,
        textAlign: "center",
        color: Colors.anotherPeachColor,
    },
    icon: {
        fontSize: 34,
    },
    image: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    rightContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    progressBar: {
        height: 5,
        borderRadius: 5,
        marginHorizontal: 20,
        width: 250,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
})