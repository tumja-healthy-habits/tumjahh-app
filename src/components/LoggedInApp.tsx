import { createBottomTabNavigator, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import ChallengeScreen from "screens/ChallengeScreen";
import HomeScreen from "screens/HomeScreen";
import ProfileScreenAlt from "screens/ProfileScreenAlt";
import SettingsButton from "./SettingsButton";
import { Ionicons } from '@expo/vector-icons';
import FeedScreen from "screens/FeedScreen";
import { createURL } from "expo-linking";
import ProfileNavigator from "screens/ProfileNavigator";
import InfiniteGridTest from "screens/InfiniteGridTest";
import InfiniteGridTestCopy from "screens/InfiniteGridTest copy";

export type AppParamList = {
    Home: undefined,
    Profile: undefined,
    Friends: undefined,
    Challenges: undefined,
    Feed: undefined,
    Test: undefined,
}

const Tab = createBottomTabNavigator<AppParamList>();

const navigatorOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: Colors.accent,
    headerStyle: {
        backgroundColor: Colors.white,
    },
    tabBarActiveBackgroundColor: "white",
    tabBarInactiveBackgroundColor: "white",
    headerTitleStyle: {
        fontWeight: 'bold',
        color: Colors.accent,
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
        <NavigationContainer linking={linking} >
            <Tab.Navigator initialRouteName='Feed' screenOptions={navigatorOptions}>
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
                <Tab.Screen name="Test" component={InfiniteGridTestCopy} options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}