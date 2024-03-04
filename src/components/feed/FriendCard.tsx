import UserBar from "components/feed/UserBar";
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ListRenderItemInfo, NativeScrollEvent, NativeScrollPoint, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { pb } from "src/pocketbaseService";
import { PhotosRecord, UserRecord } from "types";

const WIDTH: number = (0.9 * Dimensions.get("window").width)
const ARROW_SIZE: number = 20

type FriendCardProps = {
    user: UserRecord,
}

export function getOneDayAgo() {
    let oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1))
    let dd = oneDayAgo.getUTCDate()
    let dayString = dd <= 9 ? `0${dd}` : `${dd}`
    let mm = oneDayAgo.getUTCMonth()
    let monthString = mm + 1 <= 9 ? `0${mm + 1}` : `${mm + 1}`
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
    const flatListRef = useRef<FlatList<PhotosRecord>>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0)

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
        return <View />
    }

    function handleNextPhoto() {
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex((currentIndex: number) => currentIndex + 1)
            flatListRef.current?.scrollToIndex({ animated: true, index: currentPhotoIndex + 1 })
        }
    }

    function handlePreviousPhoto() {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex((currentIndex: number) => currentIndex - 1)
            flatListRef.current?.scrollToIndex({ animated: true, index: currentPhotoIndex - 1 })
        }
    }

    function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const targetContentOffset: NativeScrollPoint | undefined = event.nativeEvent.targetContentOffset
        if (targetContentOffset === undefined) return
        setCurrentPhotoIndex(Math.floor(targetContentOffset.x / WIDTH))
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
            <UserBar user={user} style={{ backgroundColor: "white", borderTopLeftRadius: 25, borderTopRightRadius: 25 }} />

            {/* Collage of User's Images */}
            <View style={styles.horizontalScroll}>
                <FlatList
                    ref={flatListRef}
                    data={photos}
                    horizontal
                    keyExtractor={(photo: PhotosRecord) => photo.id}
                    renderItem={renderPhoto}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onScrollEndDrag={handleScrollEnd}
                />
                {currentPhotoIndex < photos.length - 1 && <IconButton icon="chevron-right" size={ARROW_SIZE} onPress={handleNextPhoto} style={[styles.arrow, { right: 0 }]} />}
                {currentPhotoIndex > 0 && <IconButton icon="chevron-left" size={ARROW_SIZE} onPress={handlePreviousPhoto} style={[styles.arrow, { left: 0 }]} />}
            </View>
        </View>
        // </View> 
    );

}


const styles = StyleSheet.create({
    outerContainer: {
        borderRadius: 25,
        marginVertical: 20,
        alignSelf: "center"
    },
    horizontalScroll: {
        width: WIDTH,
        justifyContent: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        overflow: "hidden",
    },
    image: {
        width: WIDTH,
        height: WIDTH,
        aspectRatio: 1,
    },
    arrow: {
        position: "absolute",
        bottom: WIDTH / 2 - ARROW_SIZE / 2,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
    }

})