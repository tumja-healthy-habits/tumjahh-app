import { RouteProp, useRoute } from "@react-navigation/native";
import { ProfileParamList } from "./ProfileNavigator";
import { View, Text } from "react-native";

export default function AddFriendScreen() {
    const { params } = useRoute<RouteProp<ProfileParamList, 'AddFriend'>>()

    return (
        <View>
            <Text>Add friend with id {params.userId}</Text>
        </View>
    )
}