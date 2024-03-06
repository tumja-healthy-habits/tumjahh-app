import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Colors from "constants/colors";
import { cancelScheduledNotificationAsync, scheduleNotificationAsync } from 'expo-notifications';
import React, { useEffect } from "react";
import { AppState } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import DailyChallengesScreen from 'screens/DailyChallengesScreen';
import FeedScreen from 'screens/FeedScreen';
import MosaicNavigator from 'screens/mosaic/MosaicNavigator';
import ProfileNavigator from "screens/profile/ProfileNavigator";
import FriendsProvider from 'src/store/FriendsProvider';
import MosaicsProvider from 'src/store/MosaicsProvider';
import WeeklyChallengesProvider from 'src/store/WeeklyChallengesProvider';
import WeekFeedbackModal from './challenges/WeekFeedbackModal';
import SurveyPopup from './survey/SurveyPopup';

const VAR_REMINDER_NOTIFICATION_ID: string = "BeHealthyReminderNotificationId"
const DAYS_UNTIL_REMINDER: number = 2

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
        <FriendsProvider>
            <MosaicsProvider>
                <WeeklyChallengesProvider>
                    <PaperProvider>
                        <Tab.Navigator initialRouteName='Challenges' screenOptions={navigatorOptions}>
                            <Tab.Screen name="Challenges" component={DailyChallengesScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                            }} />
                            <Tab.Screen name="Feed" component={FeedScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
                            }} />
                            <Tab.Screen name="Mosaic" component={MosaicNavigator} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
                            }} />
                            <Tab.Screen name="Profile" component={ProfileNavigator} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                            }} />
                        </Tab.Navigator>
                        <SurveyPopup />
                        <WeekFeedbackModal />
                        {/* {(() => { console.log("rendering"); return null })()} */}
                    </PaperProvider>
                </WeeklyChallengesProvider>
            </MosaicsProvider>
        </FriendsProvider>
    )
}