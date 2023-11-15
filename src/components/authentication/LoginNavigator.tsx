import { createStackNavigator } from "@react-navigation/stack";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export type LoginParamList = {
    "SignupForm":undefined,
    "LoginForm": undefined
}

const Stack = createStackNavigator<LoginParamList>()

export default function LoginNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoginForm" component={LoginForm} />
            <Stack.Screen name="SignupForm" component={SignupForm} />
        </Stack.Navigator>
    )
}