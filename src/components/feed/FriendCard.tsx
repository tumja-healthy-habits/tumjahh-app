import UserBar from "components/feed/UserBar";
import { useEffect, useState } from 'react';
import { FlatList, Image, ListRenderItemInfo, StyleSheet, View, Dimensions } from "react-native";
import { pb } from "src/pocketbaseService";
import { PhotosRecord, UserRecord } from "types";


type FriendCardProps = {
    user: UserRecord,
}

export function getOneDayAgo() {
    let oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1))
    let dd = oneDayAgo.getUTCDate()
    let dayString = dd <= 9 ? `0${dd}` : `${dd}`
    let mm = oneDayAgo.getUTCMonth()
    let monthString = mm+1 <= 9 ? `0${mm+1}` : `${mm+1}`
    let year = oneDayAgo.getUTCFullYear()
    let h = oneDayAgo.getUTCHours()
    let hourString = h <= 9 ? `0${h}` : `${h}`
    let m = oneDayAgo.getUTCMinutes()
    let minString = m <= 9 ? `0${m}` : `${m}`
    let s = oneDayAgo.getUTCSeconds()
    let secString = s <= 9 ? `0${s}` : `${s}`

    return `${year}-${monthString}-${dayString} ${hourString}:${minString}:${secString}`
}

export default function FriendCard({ user }: FriendCardProps) {
    const [photos, setPhotos] = useState<PhotosRecord[]>([])

    function handleTapFriend(): void {
        console.log("TODO Add friend")
        // TODO: In the future we can perform some action when the user taps on a friend card
    }


    useEffect(() => {
        let oneDayAgo = getOneDayAgo()

        //console.log(oneDayAgo)
        pb.collection("photos")
            .getFullList<PhotosRecord>({ filter: `user_id="${user.id}" && created >= "${oneDayAgo}"`, sort: '-updated' })
            .then(setPhotos)
        
    })
    if (photos.length === 0) {
        //console.log("No photos for friend" + user.username)
        return null
    }

    function renderPhoto({ item }: ListRenderItemInfo<PhotosRecord>) {
        const imgURL: string = pb.getFileUrl(item, item.photo)
        //Image.getSize(imgURL, (width, height) => {setImgSize({width:width, height:height})});
        return (
            <Image
                source={{ uri: imgURL }}
                style={styles.image} 
                resizeMode="cover"
            />
        );
    }

    return (
        <View style={styles.outerContainer}>
            {/* User Information Bar */}
            <UserBar user={user} style={{backgroundColor:"white", borderTopLeftRadius:25, borderTopRightRadius:25}}/>

            {/* Collage of User's Images */}
            <View style={styles.horizontalScroll}>
                <FlatList
                    data={photos}
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(photo: PhotosRecord) => photo.id}
                    renderItem={renderPhoto}
                    snapToAlignment="center"
                    decelerationRate={"fast"} 
                    snapToInterval={(0.9 * Dimensions.get("window").width)} 
                />
            </View>
        </View>
        // </View> 
    );

}

const styles = StyleSheet.create({
    outerContainer: {
        borderRadius: 25,
        marginVertical:20,
        alignSelf:"center"
    },
    horizontalScroll: {
        width: (0.9 * Dimensions.get("window").width),
        height: (0.9 * Dimensions.get("window").width),
        justifyContent: 'center',
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25
    },
    image: {
        width: (0.9 * Dimensions.get("window").width), 
        height: (0.9 * Dimensions.get("window").width), 
        aspectRatio: 1,
        borderBottomRightRadius:25,
        borderBottomLeftRadius:25
    }

})