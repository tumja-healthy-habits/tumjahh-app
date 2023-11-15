import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ProgressBar } from "react-native-paper";
import { HomeStackNavigatorParamList } from "screens/HomeScreen";
import { pb } from "src/pocketbaseService";
import { DailyChallenge } from "src/store/DailyChallengesProvider";
import { AppParamList } from "../LoggedInApp";

const OPEN_CAMERA_DELAY: number = 300 // in milliseconds

type DailyChallengeProps = {
    dailyChallenge: DailyChallenge,
    openCamera: (challengeName: string) => void,
}

export default function DailyChallengeButton({ dailyChallenge, openCamera }: DailyChallengeProps) {
    const navigation = useNavigation<NavigationProp<HomeStackNavigatorParamList, "Challenges">>()
    const appNavigation = useNavigation<NavigationProp<AppParamList>>()
    const { name } = dailyChallenge.challengeEntry.record
    const [tickedOff, setTickedOff] = useState<boolean>(false)
    const [showCameraIcon, setShowCameraIcon] = useState<boolean>(false)

    function tickOffChallenge(): void {
        if (dailyChallenge.photo === null) {
            setTimeout(() => openCamera(name), OPEN_CAMERA_DELAY)
            setTimeout(() => setShowCameraIcon(true), OPEN_CAMERA_DELAY + 1000)
        }
    }

    function handleClickCheckbox(pressed: boolean): void {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setTickedOff(pressed)
        if (pressed) tickOffChallenge()
    }

    function openMosaic(): void {
        if (dailyChallenge.photo === null) return
        appNavigation.navigate("Mosaic", {
            imageUri: dailyChallenge.photo.photo,
        })
    }

    if (dailyChallenge.photo === null) return (
        <Pressable
            style={({ pressed }) => [styles.outerContainer, pressed && { backgroundColor: Colors.anotherPeachColor }]}
            onPress={() => { }}
        >
            {({ pressed }) => <>
                <View style={styles.nameAndButtonsContainer}>
                    <Text style={[styles.buttonText, pressed && { color: Colors.white }]}>
                        {name}
                    </Text>
                    <View style={styles.rightContainer}>
                        <BouncyCheckbox
                            size={35}
                            isChecked={tickedOff}
                            onPress={handleClickCheckbox}
                            fillColor={Colors.anotherPeachColor}
                            disabled={tickedOff} />
                        {showCameraIcon && <Ionicons style={styles.icon} name="camera-outline" color={pressed ? Colors.white : Colors.black} />}
                    </View>
                </View>
                <View style={styles.progressContainer}>
                    <ProgressBar progress={0.6} color={Colors.anotherPeachColor} style={styles.progressBar} />
                    <Text style={styles.buttonText}>2/3</Text>
                </View>
            </>}
        </Pressable>
    )

    const uri: string = pb.getFileUrl(dailyChallenge.photo, dailyChallenge.photo.photo)

    return (
        <Pressable
            style={({ pressed }) => [styles.outerContainer, pressed && { backgroundColor: Colors.anotherPeachColor }]}
            onPress={openMosaic}
        >
            {({ pressed }) => (<View>
                <View style={styles.nameAndButtonsContainer}>
                    <Text style={[styles.buttonText, pressed && { color: Colors.white }]}>{name}</Text>
                    <Ionicons style={styles.icon} name="grid-outline" color={pressed ? Colors.white : Colors.black} />
                </View>
                <Image source={{ uri: uri }} style={styles.image} />
            </View>)}
        </Pressable>
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