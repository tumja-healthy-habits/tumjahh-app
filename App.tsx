import LoggedInApp from 'components/LoggedInApp';
import LoginForm from 'components/LoginForm';
import SignupForm from 'components/SignupForm';
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