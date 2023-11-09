import LoggedInApp from 'components/LoggedInApp';
import { setNotificationHandler } from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { createURL } from "expo-linking";
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserProvider';
import { AppParamList } from 'components/LoggedInApp';
import LoginNavigator from 'components/LoginNavigator';

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

export default function App() {
  // useEffect(() => {
  //   // update the last logged in time
  //   AsyncStorage.setItem("lastActive", Date.now().toString())
  //   getStatusAsync().then((status) => {
  //     console.log("Background fetch status:", status)
  //   })
  //   // register background inactivity checking task
  //   registerTaskAsync(INACTIVITY_TASK_NAME, {
  //     minimumInterval: 5,
  //     stopOnTerminate: false,
  //     startOnBoot: true,
  //   })
  // }, [])
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