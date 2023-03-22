import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from 'screens/HomeScreen';
import FeedScreen from 'screens/FeedScreen';
import FriendsScreen from 'screens/FriendsScreen';
import { NavigationContainer } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Colors from 'constants/colors';

const Tab = createBottomTabNavigator()

export default function App() {
  const [userData, setUserData] = useState<any[]>([]) // default value in the brackets

  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <Tab.Navigator initialRouteName='Home' screenOptions={{
          tabBarActiveTintColor: Colors.accent,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.accent,
          }
        }}>
          <Tab.Screen name="Feed" component={FeedScreen} options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
          }} />
          <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          }} />
          <Tab.Screen name="Friends" component={FriendsScreen} options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
          }} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}