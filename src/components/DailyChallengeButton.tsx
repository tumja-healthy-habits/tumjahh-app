import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { HomeStackNavigatorParamList } from "screens/HomeScreen";
import { DailyChallenge } from "src/store/DailyChallengesProvider";
import { AppParamList } from "./LoggedInApp";

type DailyChallengeProps = {
    dailyChallenge: DailyChallenge,
}

export default function DailyChallengeButton({ dailyChallenge }: DailyChallengeProps) {
    const navigation = useNavigation<NavigationProp<HomeStackNavigatorParamList, "Challenges">>()
    const appNavigation = useNavigation<NavigationProp<AppParamList>>()
    const { name } = dailyChallenge.challengeEntry.record

    function openCamera(): void {
        if (dailyChallenge.photo === null) {
            navigation.navigate("Take Photo", {
                challengeName: name,
            })
        }
    }

    function openMosaique(): void {
        if (dailyChallenge.photo === null) return
        appNavigation.navigate("Mosaique", {
            imageUri: dailyChallenge.photo.photo,
        })
    }

    if (dailyChallenge.photo === null) return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && { backgroundColor: Colors.anotherPeachColor }]}
            onPress={openCamera}
        >
            {({ pressed }) =>
                <View style={styles.innerContainer}>
                    <Text style={[styles.buttonText, pressed && { color: Colors.white }]}>
                        {name}
                    </Text>
                    <Ionicons style={styles.icon} name="camera-outline" color={pressed ? Colors.white : Colors.black} />
                </View>
            }
        </Pressable>
    )

    const uri: string = dailyChallenge.photo.photo /* pb.getFileUrl(dailyChallenge.photo, dailyChallenge.photo.photo) */

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && { backgroundColor: Colors.anotherPeachColor }]}
            onPress={openMosaique}
        >
            {({ pressed }) => (<View>
                <View style={styles.innerContainer}>
                    <Text style={[styles.buttonText, pressed && { color: Colors.white }]}>{name}</Text>
                    <Ionicons style={styles.icon} name="grid-outline" color={pressed ? Colors.white : Colors.black} />
                </View>
                <Image source={{ uri: uri }} style={styles.image} />
            </View>)}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        marginVertical: 15,
        marginHorizontal: 15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: Colors.white,
    },
    innerContainer: {
        margin: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonText: {
        fontSize: 18,
        textAlign: "center",
        color: Colors.anotherPeachColor,
    },
    icon: {
        fontSize: 24,
        marginLeft: 10,
    },
    image: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
})