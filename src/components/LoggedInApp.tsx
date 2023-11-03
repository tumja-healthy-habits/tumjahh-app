import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import Colors from "constants/colors";
import { createURL } from "expo-linking";
import React from "react";
import { PaperProvider } from 'react-native-paper';
import ChallengeScreen from "screens/ChallengeScreen";
import FeedScreen from 'screens/FeedScreen';
import MosaicScreen from "screens/MosaicScreen";
import ProfileNavigator from "screens/ProfileNavigator";
import DailyChallengesProvider from 'src/store/DailyChallengesProvider';
import MosaicDataProvider from "src/store/MosaicDataProvider";
import SettingsButton from "./SettingsButton";

export type AppParamList = {
    Profile: undefined,
    Challenges: undefined,
    Feed: undefined,
    Mosaic: {
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
    return (
        <MosaicDataProvider>
            <DailyChallengesProvider>
                <PaperProvider>
                    <NavigationContainer linking={linking} >
                        <Tab.Navigator initialRouteName='Challenges' screenOptions={navigatorOptions}>
                            <Tab.Screen name="Challenges" component={ChallengeScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                            }} />
                            <Tab.Screen name="Feed" component={FeedScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
                            }} />
                            {/* <Tab.Screen name="Home" component={HomeScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                                headerShown: false,
                            }} /> */}
                            {/* <Tab.Screen name="Friends" component={FriendsScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
                              }} /> */}
                            <Tab.Screen name="Profile" component={ProfileNavigator} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                                headerRight: () => <SettingsButton />,
                            }} />
                            <Tab.Screen name="Mosaic" component={MosaicScreen} options={{
                                tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
                            }} />
                        </Tab.Navigator>
                    </NavigationContainer>
                </PaperProvider>
            </DailyChallengesProvider>
        </MosaicDataProvider>
    )
}