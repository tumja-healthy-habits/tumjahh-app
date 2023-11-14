import { useEffect, useState } from 'react';
import { FlatList, Image, ListRenderItemInfo, StyleSheet, View } from "react-native";
import UserBar from "src/components/UserBar";
import { pb } from "src/pocketbaseService";
import { PhotosRecord, UserRecord } from "types";


type FriendCardProps = {
    user: UserRecord,
}

export default function FriendCard({ user }: FriendCardProps) {
    const [photos, setPhotos] = useState<PhotosRecord[]>([])

    function handleTapFriend(): void {
        // TODO: In the future we can perform some action when the user taps on a friend card
    }
    useEffect(() => {
        pb.collection("photos")
            .getFullList<PhotosRecord>({ filter: `user_id="${user.id}"`, sort: 'updated' })
            .then(setPhotos)
    })
    if (photos.length === 0) {
        return null
    }

    function renderPhoto({ item }: ListRenderItemInfo<PhotosRecord>) {
        const imgURL: string = pb.getFileUrl(item, item.photo)
        //Image.getSize(imgURL, (width, height) => {setImgSize({width:width, height:height})});
        return (
            <Image
                source={{ uri: imgURL }}
                style={{ width: undefined, height: '100%', aspectRatio: item.width / item.height, marginRight: 5 }}
                resizeMode="contain"
            />
        );
    }

    return (
        <View>
            {/* User Information Bar */}
            <UserBar user={user} />

            {/* Collage of User's Images */}
            <View style={styles.horizontalScroll}>
                <FlatList
                    data={photos}
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(photo: PhotosRecord) => photo.id}
                    renderItem={renderPhoto}
                />
            </View>
        </View>
        // </View> 
    );

}

const styles = StyleSheet.create({
    horizontalScroll: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
    },

})