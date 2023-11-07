import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import Colors from "constants/colors";
import { createURL } from "expo-linking";
import { cancelScheduledNotificationAsync, scheduleNotificationAsync } from 'expo-notifications';
import React, { useEffect } from "react";
import { AppState } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import ChallengeScreen from "screens/ChallengeScreen";
import HomeScreen from "screens/HomeScreen";
import MosaiqueScreen from "screens/MosaiqueScreen";
import ProfileNavigator from "screens/ProfileNavigator";
import DailyChallengesProvider from 'src/store/DailyChallengesProvider';
import MosaiqueDataProvider from "src/store/MosaiqueDataProvider";
import SettingsButton from "./SettingsButton";

const VAR_REMINDER_NOTIFICATION_ID: string = "BeHealthyReminderNotificationId"

export type AppParamList = {
    Home: undefined,
    Profile: undefined,
    Friends: undefined,
    Challenges: undefined,
    Feed: undefined,
    Mosaique: {
        imageUri?: string,
    },
}

const Tab = createBottomTabNavigator<AppParamList>();

const navigatorOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: Colors.anotherPeachColor,
    headerStyle: {
        backgroundColor: Colors.white,
    },
    tabBarActiveBackgroundColor: "white",
    tabBarInactiveBackgroundColor: "white",
    headerTitleStyle: {
        fontWeight: 'bold',
        color: "black",
    },
}

const prefix: string = createURL('/')
const linking: LinkingOptions<AppParamList> = {
    prefixes: [prefix],
    config: {
        screens: {
            Profile: {
                screens: {
                    SearchFriend: {
                        path: 'addfriend/:friendId',
                        parse: {
                            friendId: (friendId: string) => `${friendId}`,
                        },
                        stringify: {
                            friendId: (friendId: string) => `${friendId}`,
                        },
                    }
                }
            }
        }
    }
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
                        seconds: 10,
                        repeats: false,
                    }
                })
            }
        })
    })
    return (
        <MosaiqueDataProvider>
            <DailyChallengesProvider>
                <PaperProvider>
                    <NavigationContainer linking={linking} >
                        <Tab.Navigator initialRouteName='Home' screenOptions={navigatorOptions}>
                            <Tab.Screen name="Challenges" component={ChallengeScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                            }} />
                            {/* <Tab.Screen name="Feed" component={FeedScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
                            }} /> */}
                            <Tab.Screen name="Home" component={HomeScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                                headerShown: false,
                            }} />
                            {/* <Tab.Screen name="Friends" component={FriendsScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
                              }} /> */}
                            <Tab.Screen name="Profile" component={ProfileNavigator} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                                headerRight: () => <SettingsButton />,
                            }} />
                            <Tab.Screen name="Mosaique" component={MosaiqueScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
                            }} />
                        </Tab.Navigator>
                    </NavigationContainer>
                </PaperProvider>
            </DailyChallengesProvider>
        </MosaiqueDataProvider>
    )
}