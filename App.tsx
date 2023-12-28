import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import LoggedInApp, { AppParamList } from 'components/LoggedInApp';
import LoginNavigator from 'components/authentication/LoginNavigator';
import { createURL } from "expo-linking";
import { setNotificationHandler } from 'expo-notifications';
import { SafeAreaView, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import EventSource from "react-native-sse";
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserProvider';

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


setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
})

global.EventSource = EventSource as any

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer linking={linking} >
          <AuthenticatedUserProvider>
            <AuthenticatedUserContext.Consumer>
              {({ currentUser }) => currentUser ? <LoggedInApp /> : <LoginNavigator />}
            </AuthenticatedUserContext.Consumer>
          </AuthenticatedUserProvider>
        </NavigationContainer>
      </SafeAreaView >
    </SafeAreaProvider>
  );
}