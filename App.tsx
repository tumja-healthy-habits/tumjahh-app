import { StatusBar } from 'expo-status-bar';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserContext';
import { NavigationContainer } from '@react-navigation/native';
import Colors from 'constants/colors'
import FeedScreen from 'screens/FeedScreen';
import ChallengeScreen from 'screens/ChallengeScreen';
import ProfileScreen from 'screens/ProfileScreen';
import FriendsScreen from 'screens/FriendsScreen';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginForm from 'components/LoginForm';
import SettingsButton from 'components/SettingsButton';
import ProfileScreenAlt from 'screens/ProfileScreenAlt';

const Tab = createBottomTabNavigator();

const navigatorOptions: BottomTabNavigationOptions = {
  tabBarActiveTintColor: Colors.accent,
  headerStyle: {
    backgroundColor: Colors.background,
  },
  tabBarActiveBackgroundColor: Colors.background,
  tabBarInactiveBackgroundColor: Colors.background,
  headerTitleStyle: {
    fontWeight: 'bold',
    color: Colors.accent,
  },
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthenticatedUserProvider>
        <AuthenticatedUserContext.Consumer>
          {({ currentUser }) => (
            currentUser ?
              <NavigationContainer>
                <Tab.Navigator initialRouteName='Feed' screenOptions={navigatorOptions}>
                  <Tab.Screen name="Challenges" component={ChallengeScreen} options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
                  }} />
                  <Tab.Screen name="Feed" component={FeedScreen} options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
                  }} />
                  <Tab.Screen name="Friends" component={FriendsScreen} options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
                  }} />
                  <Tab.Screen name="Profile" component={ProfileScreenAlt} options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                    headerRight: () => <SettingsButton />,
                  }} />
                </Tab.Navigator>
              </NavigationContainer>
              :
              <LoginForm />)}
        </AuthenticatedUserContext.Consumer>
      </AuthenticatedUserProvider>
    </>
  );
}