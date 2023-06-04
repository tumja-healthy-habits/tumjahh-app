import LoginForm from 'components/LoginForm';
import ProfilePicture from 'components/ProfilePicture';
import React from 'react';
import { Text, View, StyleSheet, Pressable, Button } from 'react-native';
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserContext';
import Colors from "constants/colors";
import EditableTextField from 'components/EditableTextField';
import { pb } from "src/pocketbaseService";
import { RecordQueryParams } from 'pocketbase';

export default function Profile() {
    const { currentUser } = useAuthenticatedUser();
    // const dummyUser = { "avatar": "", "collectionId": "_pb_users_auth_", "collectionName": "users", "created": "2023-03-20 16:12:56.015Z", "emailVisibility": false, "expand": {}, "id": "i3w0162pbgzwc6u", "name": "Test", "updated": "2023-03-21 16:05:49.687Z", "username": "users16721", "verified": false, "email": "test@tum.de" };
    // currentUser = dummyUser;
    if (currentUser === null) {
        return <LoginForm />;
    }

    function update(data: RecordQueryParams) {
        if (currentUser === null) return;
        pb.collection(currentUser.collectionId).update(currentUser.id, data)
    }

    return (
        <View style={styles.container}>
            <EditableTextField placeholder='Name' editableText={currentUser.name} updateFunction={(nameUpdate: string) => update({ name: nameUpdate })} style={{ fontSize: 30 }} />
            <ProfilePicture user={currentUser} style={styles.profilePicture} />
            <EditableTextField placeholder='Username' editableText={currentUser.username} updateFunction={(usernameUpdate: string) => update({ username: usernameUpdate })} style={{ fontSize: 18 }} />
            <EditableTextField placeholder='Email' editableText={currentUser.email} updateFunction={(emailUpdate: string) => update({ email: emailUpdate })} style={{ fontSize: 18 }} />
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