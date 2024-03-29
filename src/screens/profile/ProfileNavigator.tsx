import { StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";
import AddFriendScreen from "./AddFriendScreen";
import ProfileScreenAlt from "./ProfileScreen";
import SearchFriendScreen from "./SearchFriendScreen";
import FriendScreen from "./FriendScreen";

export type ProfileParamList = {
    "ProfilePage": undefined;
    "SearchFriend": {
        friendId?: string,
    },
    "AddFriend": {
        userId: string,
    }
}

const Stack = createStackNavigator<ProfileParamList>()

const navigatorOptions: StackNavigationOptions = {
    headerShown: false,
}

export default function ProfileNavigator() {
    return (
        <Stack.Navigator screenOptions={navigatorOptions}>
            <Stack.Screen name="ProfilePage" component={ProfileScreenAlt} />
            <Stack.Screen name="SearchFriend" component={SearchFriendScreen} />
            <Stack.Screen name="AddFriend" component={AddFriendScreen} />
        </Stack.Navigator>
    )
}