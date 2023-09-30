import { createStackNavigator } from "@react-navigation/stack"
import DailyChallengesScreen from "./DailyChallengesScreen"
import TakePhotoScreen from "./TakePhotoScreen"

export type HomeStackNavigatorParamList = {
    "Challenges": undefined,
    "Take Photo": {
        challengeName: string,
    },
}

const Stack = createStackNavigator<HomeStackNavigatorParamList>()

export default function HomeScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Challenges" component={DailyChallengesScreen} options={{
                headerShown: true,
            }} />
            <Stack.Screen name="Take Photo" component={TakePhotoScreen} />
        </Stack.Navigator>
    )
}