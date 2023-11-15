import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import LoggedInApp, { AppParamList } from 'components/LoggedInApp';
import LoginNavigator from 'components/LoginNavigator';
import { createURL } from "expo-linking";
import { setNotificationHandler } from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
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
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <NavigationContainer linking={linking} >
        <AuthenticatedUserProvider>
          <AuthenticatedUserContext.Consumer>
            {({ currentUser }) => currentUser ? <LoggedInApp /> : <LoginNavigator />}
          </AuthenticatedUserContext.Consumer>
        </AuthenticatedUserProvider>
      </NavigationContainer>
    </View>
  );
}