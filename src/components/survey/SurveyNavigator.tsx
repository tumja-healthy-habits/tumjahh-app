import { StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";
import LoggedInApp from "components/LoggedInApp";
import InitialSurvey from "./InitialSurvey";
import Survey from "./Survey";

export type SurveyParamList = {
    "SurveyPopup": undefined;
    "InitialSurvey": undefined;
    "Survey": {
        categories: string[],
    }
}

const Stack = createStackNavigator<SurveyParamList>()

export default function SurveyNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SurveyPopup" component={LoggedInApp} />
            <Stack.Screen name="InitialSurvey" component={InitialSurvey} />
            <Stack.Screen name="Survey" component={Survey} />
        </Stack.Navigator>
    )
}