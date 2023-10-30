import { styles, imageStyles } from "../styles";
import { ScrollView, View, FlatList, Text, ImageSourcePropType, Image, Dimensions,  ListRenderItemInfo} from "react-native";
import { UserRecord, PhotoRecord} from "types";
import { pb } from "src/pocketbaseService";
import UserBar from "src/components/UserBar"
import { useEffect, useState } from 'react'

import ProfilePicture from "./ProfilePicture";


type FriendCardProps = {
    user: UserRecord,
}
const { width } = Dimensions.get('window');

export default function FriendCard({ user }: FriendCardProps) {
    const [photos, setPhotos] = useState<PhotoRecord[]>([])

    function handleTapFriend(): void {
        // TODO: In the future we can perform some action when the user taps on a friend card
    }
    // return (
    //     <View style={[imageStyles.outerContainer, {flex: 1}]}>
    //         <Pressable onPress={handleTapFriend}>
    //             <View style={imageStyles.innerContainer}>
    //                 <ProfilePicture user={user} style={imageStyles.image} />
    //                 <Text style={styles.textfieldText}>{user.name}</Text>
    //             </View>
    //         </Pressable>
    //     </View>
    // )
    const profilePictureSource: ImageSourcePropType = user.avatar ? { uri: pb.getFileUrl(user, user.avatar) } : require("assets/images/default-avatar.jpeg")

    useEffect(() => {
        pb.collection("photos")
        .getFullList<PhotoRecord>({filter: `user_id="${user.id}"`})
        .then(setPhotos)
    })
    if (photos.length === 0) {
        return null
    }
    // const photoURLs: string[] = photos.map((record: PhotoRecord) =>  pb.getFileUrl(record, record.photo))
    // console.log(photoURLs)
    
    // const ListImage = ({ item }: PhotoRecord) => {
    //     return (
    //       <View>
    //         <Image
    //           source={{uri: pb.getFileUrl(item, item.photo)}}
    //           style={{width:200, height:50}}
    //           resizeMode="cover"
    //         />
    //       </View>
    //     );
    //   };
    
    function renderPhoto({ item }: ListRenderItemInfo<PhotoRecord>) {
        return (
            <Image
            source={{uri: pb.getFileUrl(item, item.photo)}}
            style={{width: undefined,
                height: '100%',
                aspectRatio: 1}}
            resizeMode="contain"
            />
        );
    } 

    return (
        <View>
          {/* User Information Bar */}
          <UserBar user={user}/>

          {/* Collage of User's Images */}
            <View style={{ width: '100%', height: 300, borderWidth: 1, justifyContent: 'center'}}>
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