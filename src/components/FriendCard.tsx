import { styles, imageStyles } from "../styles";
import { ScrollView, View, FlatList, Text, ImageSourcePropType, Image, Dimensions,  ListRenderItemInfo} from "react-native";
import { UserRecord, PhotoRecord} from "types";
import { pb } from "src/pocketbaseService";
import UserBar from "src/components/UserBar"
import { useEffect, useState } from 'react'



type FriendCardProps = {
    user: UserRecord,
}

export default function FriendCard({ user }: FriendCardProps) {
    const [photos, setPhotos] = useState<PhotoRecord[]>([])

    function handleTapFriend(): void {
        // TODO: In the future we can perform some action when the user taps on a friend card
    }
    useEffect(() => {
        pb.collection("photos")
        .getFullList<PhotoRecord>({filter: `user_id="${user.id}"`, sort:'updated'})
        .then(setPhotos)
    })
    if (photos.length === 0) {
        return null
    }
    
    function renderPhoto({ item }: ListRenderItemInfo<PhotoRecord>) {
        const imgURL = pb.getFileUrl(item, item.photo)
        //Image.getSize(imgURL, (width, height) => {setImgSize({width:width, height:height})});
        return (
            <Image
            source={{uri: imgURL}}
            style={{width: undefined, height:'100%', aspectRatio: item.width/item.height, marginRight:5}}
            resizeMode="contain"
            />
        );
    } 

    return (
        <View>
          {/* User Information Bar */}
          <UserBar user={user}/>

          {/* Collage of User's Images */}
            <View style={{ width: '100%', height: 200, justifyContent: 'center'}}>
                <FlatList
                    data={photos}
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(photo:PhotoRecord) => photo.id}
                    renderItem={renderPhoto}
                />
            </View>
        </View>
        // </View> 
    );

}