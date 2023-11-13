import LoggedInApp from 'components/LoggedInApp';
import LoginForm from 'components/LoginForm';
import { setNotificationHandler } from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserProvider';

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
      <AuthenticatedUserProvider>
        <AuthenticatedUserContext.Consumer>
          {({ currentUser }) => currentUser ? <LoggedInApp /> : <LoginForm />}
        </AuthenticatedUserContext.Consumer>
      </AuthenticatedUserProvider>
    </View>
  );
}