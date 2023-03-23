import { StatusBar } from 'expo-status-bar';
import { AuthenticatedUserProvider } from 'src/store/AuthenticatedUserContext';
import { NavigationContainer } from '@react-navigation/native';
import Colors from 'constants/colors'
import FeedScreen from 'screens/FeedScreen';
import FriendsScreen from 'screens/FriendsScreen';
import HomeScreen from 'screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthenticatedUserProvider>
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Home' screenOptions={{
            tabBarActiveTintColor: Colors.accent,
            headerStyle: {
              backgroundColor: "black",
            },
            tabBarActiveBackgroundColor: "black",
            tabBarInactiveBackgroundColor: "black",
            headerTitleStyle: {
              fontWeight: 'bold',
              color: Colors.accent,
            },
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
      </AuthenticatedUserProvider>
    </>
  );
}