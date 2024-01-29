import Colors from "constants/colors";
import * as Haptics from "expo-haptics";
import React, { Component, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Icon, ProgressBar, ProgressBarProps } from "react-native-paper";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { ChallengesRecord, WeeklyChallengesRecord, categoryIcons } from "src/types";

const OPEN_CAMERA_DELAY: number = 300 // in milliseconds

function sameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
}
class ProgressBarWrapper extends Component<ProgressBarProps> {
    constructor(props: ProgressBarProps) {
        super(props)
    }

    render() {
        return <ProgressBar {...this.props} />
    }
}

const AnimatedProgressBar = Animated.createAnimatedComponent(ProgressBarWrapper)

type weeklyChallengeProps = {
    weeklyChallenge: WeeklyChallengesRecord,
    openCamera: () => void,
}

export default function WeeklyChallengeButton({ weeklyChallenge, openCamera }: weeklyChallengeProps) {
    const [tickedOff, setTickedOff] = useState<boolean>(sameDay(new Date(weeklyChallenge.last_completed), new Date()))
    const [showDescription, setShowDescription] = useState<boolean>(false)

    const challenge: ChallengesRecord = weeklyChallenge.expand.challenge_id

    function tickOffChallenge(): void {
        setTimeout(() => openCamera(), OPEN_CAMERA_DELAY)
    }

    function handleClickCheckbox(pressed: boolean): void {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setTickedOff(pressed)
        if (pressed) tickOffChallenge()
    }

    return (<Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={() => setShowDescription((oldState: boolean) => !oldState)}>
        <Animated.View style={[styles.outerContainer, { flexDirection: "row" }]} layout={Layout}>
            <View style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginRight: 15, alignSelf: "center" }}>
                        <Icon source={categoryIcons[weeklyChallenge.expand.challenge_id.category]} size={25} color={Colors.anotherPeachColor} />
                    </View>
                    <Text style={styles.buttonText}>
                        {challenge.name}
                    </Text>
                    <View style={{ marginLeft: 15, alignSelf: "center" }}>
                        <Icon source="information-outline" size={20} />
                    </View>
                </View>
                {showDescription && <Animated.Text entering={FadeIn.duration(400)} style={styles.description}>{weeklyChallenge.expand.challenge_id.description}</Animated.Text>}
                <AnimatedProgressBar layout={Layout} style={styles.progressBar} progress={weeklyChallenge.amount_planned === 0 ? 1 : Math.min(weeklyChallenge.amount_accomplished / weeklyChallenge.amount_planned)} color={Colors.anotherPeachColor} />
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
                <Animated.Text layout={Layout} style={[styles.buttonText, { marginTop: 10, bottom: -12 }]}>{weeklyChallenge.amount_accomplished}/{weeklyChallenge.amount_planned}</Animated.Text>
            </View>
        </Animated.View>
    </Pressable>
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
    checkbox: {
        left: 8,
    },
    description: {
        fontSize: 18,
        flexWrap: "wrap",
        marginTop: 15,
        marginBottom: 25,
        width: Dimensions.get("window").width * 0.65,
    },
})
