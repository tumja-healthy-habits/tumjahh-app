import LoggedInApp from 'components/LoggedInApp';
import LoginForm from 'components/LoginForm';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserProvider';

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