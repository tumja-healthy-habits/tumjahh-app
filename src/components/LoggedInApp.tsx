import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Colors from "constants/colors";
import { cancelScheduledNotificationAsync, scheduleNotificationAsync } from 'expo-notifications';
import React, { useEffect } from "react";
import { AppState } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import ChallengeScreen from "screens/ChallengeScreen";
import FriendsScreen from 'screens/FeedScreen';
import HomeScreen from 'screens/HomeScreen';
import MosaicNavigator from 'screens/mosaic/MosaicNavigator';
import ProfileNavigator from "screens/profile/ProfileNavigator";
import DailyChallengesProvider from 'src/store/DailyChallengesProvider';
import MosaicDataProvider from "src/store/MosaicDataProvider";
import SurveyPopup from './misc/SurveyPopup';

const VAR_REMINDER_NOTIFICATION_ID: string = "BeHealthyReminderNotificationId"
const DAYS_UNTIL_REMINDER: number = 3

export type AppParamList = {
    Profile: undefined,
    Challenges: undefined,
    Feed: undefined,
    Mosaic: {
        photoId?: string,
    },
    Home: undefined,
}

const Tab = createBottomTabNavigator<AppParamList>();

const navigatorOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: Colors.anotherPeachColor,
    headerShown: false,
    tabBarActiveBackgroundColor: "white",
    tabBarInactiveBackgroundColor: "white",
}

export default function LoggedInApp() {
    useEffect(() => {
        AppState.addEventListener("change", (state: string) => {
            if (state === "inactive") {
                AsyncStorage.getItem(VAR_REMINDER_NOTIFICATION_ID).then((notificationId: string | null) => {
                    if (notificationId !== null) {
                        cancelScheduledNotificationAsync(notificationId)
                    }
                })
                scheduleNotificationAsync({
                    content: {
                        title: "You have been gone for a while",
                        body: "Come back and take a photo of your healthy habit"
                    },
                    trigger: {
                        repeats: false,
                        seconds: 60 * 60 * 24 * DAYS_UNTIL_REMINDER,
                    }
                }).then((notificationId: string) => {
                    AsyncStorage.setItem(VAR_REMINDER_NOTIFICATION_ID, notificationId)
                })
            }
        })
    }, [])
    return (
        <MosaicDataProvider>
            <DailyChallengesProvider>
                <PaperProvider>
                    <Tab.Navigator initialRouteName='Feed' screenOptions={navigatorOptions}>
                        <Tab.Screen name="Feed" component={FriendsScreen} options={{
                            tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
                        }} />
                        <Tab.Screen name="Challenges" component={ChallengeScreen} options={{
                            tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                        }} />
                        <Tab.Screen name="Home" component={HomeScreen} options={{
                            tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                        }} />
                        {/* <Tab.Screen name="Friends" component={FriendsScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
                              }} /> */}
                        <Tab.Screen name="Profile" component={ProfileNavigator} options={{
                            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                        }} />
                        <Tab.Screen name="Mosaic" component={MosaicNavigator} options={{
                            tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
                        }} />
                    </Tab.Navigator>

                    <SurveyPopup/>
                </PaperProvider>
            </DailyChallengesProvider>
        </MosaicDataProvider>
    )
}