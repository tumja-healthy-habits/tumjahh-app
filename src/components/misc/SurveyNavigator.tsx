import { StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";
import SurveyPopup from "./SurveyPopup";
import Survey from "../../screens/Survey";
import { Record } from "pocketbase";

export type SurveyParamList = {
    "SurveyPopup": undefined;
    "Survey": {
        challenges: Record[],
    }
}

const Stack = createStackNavigator<SurveyParamList>()

const navigatorOptions: StackNavigationOptions = {
    headerShown: false,
}

export default function SurveyNavigator() {
    return (
        <Stack.Navigator screenOptions={navigatorOptions}>
            <Stack.Screen name="SurveyPopup" component={SurveyPopup} />
            <Stack.Screen name="Survey" component={Survey} />
        </Stack.Navigator>
    )
}