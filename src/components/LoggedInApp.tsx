import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Colors from "constants/colors";
import React from "react";
import { PaperProvider } from 'react-native-paper';
import ChallengeScreen from "screens/ChallengeScreen";
import HomeScreen from "screens/HomeScreen";
import MosaiqueScreen from "screens/MosaiqueScreen";
import ProfileNavigator from "screens/ProfileNavigator";
import DailyChallengesProvider from 'src/store/DailyChallengesProvider';
import MosaiqueDataProvider from "src/store/MosaiqueDataProvider";
import SettingsButton from "./SettingsButton";

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



export default function LoggedInApp() {
    return (
        <MosaiqueDataProvider>
            <DailyChallengesProvider>
                <PaperProvider>
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
                </PaperProvider>
            </DailyChallengesProvider>
        </MosaiqueDataProvider>
    )
}