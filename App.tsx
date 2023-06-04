import { StatusBar } from 'expo-status-bar';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserContext';
import { NavigationContainer } from '@react-navigation/native';
import Colors from 'constants/colors'
import FeedScreen from 'screens/FeedScreen';
import FriendsScreen from 'screens/FriendsScreen';
import HomeScreen from 'screens/HomeScreen';
import ProfileScreen from 'screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Pressable } from 'react-native';
import ProfileScreenAlt from 'screens/ProfileScreenAlt';
import FeedScreenCopy from 'screens/FeedScreenCopy';
import LoginForm from 'components/LoginForm';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthenticatedUserProvider>
        <AuthenticatedUserContext.Consumer>
          {({ currentUser }) => (
            currentUser ?
              <NavigationContainer>
                <Tab.Navigator initialRouteName='Feed' screenOptions={{
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
                  <Tab.Screen name="Profile" component={ProfileScreen} options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                    headerRight: () => (
                      <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]} onPress={() => console.log("settings")}>
                        <Text style={{ fontSize: 30 }}>⚙️</Text>
                      </Pressable>
                    ),
                  }} />
                  {/* <Tab.Screen name="ProfileAlt" component={ProfileScreenAlt} options={{
                  tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                }} /> */}
                </Tab.Navigator>
              </NavigationContainer>
              :
              <LoginForm />)}
        </AuthenticatedUserContext.Consumer>
      </AuthenticatedUserProvider>
    </>
  );
}