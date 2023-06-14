import { StatusBar } from 'expo-status-bar';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserContext';
import { SafeAreaView, View } from 'react-native';
import LoggedInApp from 'components/LoggedInApp';
import LoginForm from 'components/LoginForm';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
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