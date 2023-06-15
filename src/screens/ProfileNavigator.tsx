import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreenAlt from "./ProfileScreenAlt";
import SearchFriendScreen from "./SearchFriendScreen";
import AddFriendScreen from "./AddFriendScreen";

export type ProfileParamList = {
    ProfilePage: undefined;
    SearchFriend: undefined,
    AddFriend: {
        userId: string,
    }
}

const Stack = createStackNavigator<ProfileParamList>()

export default function ProfileNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfilePage" component={ProfileScreenAlt} />
            <Stack.Screen name="SearchFriend" component={SearchFriendScreen} />
            <Stack.Screen name="AddFriend" component={AddFriendScreen} />
        </Stack.Navigator>
    )
}