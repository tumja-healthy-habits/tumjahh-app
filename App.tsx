import { StatusBar } from 'expo-status-bar';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from 'src/store/AuthenticatedUserProvider';
import { View } from 'react-native';
import LoggedInApp from 'components/LoggedInApp';
import LoginForm from 'components/LoginForm';

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