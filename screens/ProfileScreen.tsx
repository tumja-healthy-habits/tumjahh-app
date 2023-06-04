import LoginForm from 'components/LoginForm';
import ProfilePicture from 'components/ProfilePicture';
import React from 'react';
import { View } from 'react-native';
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserContext';
import EditableTextField from 'components/EditableTextField';
import { pb } from "src/pocketbaseService";
import { RecordQueryParams } from 'pocketbase';
import { styles, imageStyles } from "../styles"

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
            <EditableTextField placeholder='Name' editableText={currentUser.name} updateFunction={(nameUpdate: string) => update({ name: nameUpdate })} textStyle={styles.textfieldTitle} />
            <ProfilePicture user={currentUser} style={imageStyles.profilePicture} />
            <EditableTextField placeholder='Username' editableText={currentUser.username} updateFunction={(usernameUpdate: string) => update({ username: usernameUpdate })} textStyle={styles.textfieldText} />
            <EditableTextField placeholder='Email' editableText={currentUser.email} updateFunction={(emailUpdate: string) => update({ email: emailUpdate })} textStyle={styles.textfieldText} />
        </View>
    );
}