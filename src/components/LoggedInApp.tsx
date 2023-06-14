import { createBottomTabNavigator, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import ChallengeScreen from "screens/ChallengeScreen";
import HomeScreen from "screens/HomeScreen";
import ProfileScreenAlt from "screens/ProfileScreenAlt";
import SettingsButton from "./SettingsButton";
import { Ionicons } from '@expo/vector-icons';
import FeedScreen from "screens/FeedScreen";

const Tab = createBottomTabNavigator();

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

export default function LoggedInApp() {
    return (
        <NavigationContainer>
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
                <Tab.Screen name="Profile" component={ProfileScreenAlt} options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                    headerRight: () => <SettingsButton />,
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}