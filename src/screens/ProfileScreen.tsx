import EditableTextField from 'components/EditableTextField';
import LoginForm from 'components/LoginForm';
import ProfilePicture from 'components/ProfilePicture';
import Colors from "constants/colors";
import { RecordQueryParams } from 'pocketbase';
import React from 'react';
import { Button, View } from 'react-native';
import { logout } from 'src/authentification';
import { pb } from "src/pocketbaseService";
import { useAuthenticatedUser } from 'src/store/AuthenticatedUserProvider';
import { imageStyles, styles } from "src/styles";

export default function Profile() {
    const { currentUser } = useAuthenticatedUser();
    if (currentUser === null) {
        return <LoginForm />;
    }

    function update(data: RecordQueryParams) {
        if (currentUser === null) return;
        pb.collection(currentUser.collectionId).update(currentUser.id, data)
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors.backgroundProfile }]}>
            <EditableTextField placeholder='Name' editableText={currentUser.name} updateFunction={(nameUpdate: string) => update({ name: nameUpdate })} textStyle={styles.textfieldTitle} />
            <ProfilePicture userRecord={currentUser} style={imageStyles.profilePicture} />
            <EditableTextField placeholder='Username' editableText={currentUser.username} updateFunction={(usernameUpdate: string) => update({ username: usernameUpdate })} textStyle={styles.textfieldText} />
            <EditableTextField placeholder='Email' editableText={currentUser.email} updateFunction={(emailUpdate: string) => update({ email: emailUpdate })} textStyle={styles.textfieldText} />
            <Button title="Log out" onPress={logout} color={Colors.accent}></Button>
        </View>
    );
}