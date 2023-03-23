import { useState } from 'react';
import { pb } from "src/pocketbaseService"
import { StatusBar } from 'expo-status-bar';
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserContext';
import { NavigationContainer } from '@react-navigation/native';
import Colors from 'constants/colors'
import FeedScreen from 'screens/FeedScreen';
import FriendsScreen from 'screens/FriendsScreen';
import HomeScreen from 'screens/HomeScreen';
import { UserRecord } from 'types';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ListResult } from 'pocketbase';

async function fetchFriendsList(id: string): Promise<any[]> {
  const data: ListResult<UserRecord> = await pb.collection("friends_with").getList(undefined, undefined, {
    filter: `user1 = ${id}`,
    expand: "user2",
  })
  return data.items
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [userData, setUserData] = useState<UserRecord[]>([]) // default value in the brackets
  const { currentUser } = useAuthenticatedUser()

  function getUserData(): void {
    if (currentUser === null) return
    fetchFriendsList(currentUser.id)
      .then(userData => setUserData(userData))
      .catch(() => console.error("An error occured while fetching the user data from pocketbase!"))
  }

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