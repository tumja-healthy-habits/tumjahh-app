import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { ProfileParamList } from "screens/ProfileNavigator";
import { UserRecord } from "types";
import ProfilePicture from "./ProfilePicture";

type FriendSearchResultProps = {
    user: UserRecord,
}

export default function FriendSearchResult({ user }: FriendSearchResultProps) {

    const { setParams } = useNavigation<NavigationProp<ProfileParamList, 'SearchFriend'>>()

    function handleTapFriend(): void {
        console.log("TODO Add friend")
        setParams({
            friendId: user.id,
        })
    }

    return <Pressable style={({ pressed }) => [styles.container, pressed && { opacity: 0.3 }]} onPress={handleTapFriend}>
        <ProfilePicture userRecord={user} style={styles.image} />
        <View style={styles.innerContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
        </View>
        <Button
            mode="outlined"
            onPress={handleTapFriend}
            buttonColor={Colors.pastelGreen}
            labelStyle={{ fontSize: 16 }}
            icon={() => <Ionicons name="person-add-outline" size={20} />}>Add</Button>
    </Pressable>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        padding: 10,
        margin: 10,
    },
    innerContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        marginLeft: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    username: {
        fontSize: 16,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 25,
        borderWidth: 2,
    }
})