import LoginForm from 'components/LoginForm';
import ProfilePicture from 'components/ProfilePicture';
import React from 'react';
import { Text, View, StyleSheet, Pressable, Button } from 'react-native';
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserContext';
import Colors from "constants/colors";

export default function Profile() {
    var { currentUser } = useAuthenticatedUser();
    const dummyUser = { "avatar": "", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 16:12:56.015Z", "emailVisibility": false, "expand": {}, "id": "i3w0162pbgzwc6u", "name": "Test", "updated": "2023-03-21 16:05:49.687Z", "username": "users16721", "verified": false, "email": "test@tum.de" };
    currentUser = dummyUser;
    // if (currentUser === null) {
    //     return <LoginForm />;
    // }

    return (
        <View style={styles.container}>
            <Text style={styles.textField}>
                {currentUser.name}
            </Text>
            <Text style={styles.textField}>
                {currentUser.username}
            </Text>
            <Text style={styles.textField}>
                {currentUser.email}
            </Text>
            <View>
                <ProfilePicture user={currentUser} style={styles.profilePicture} />
            </View>
            <Button title='Edit Profile' />
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textField: {
        color: Colors.primary,
    },
    profilePicture: {
        width: 150,
        height: 150,
    },
});