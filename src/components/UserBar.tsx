import {UserRecord} from "types"
import{View, Text, ImageSourcePropType, Image, Appearance} from "react-native"
import { pb } from "src/pocketbaseService";


type UserBarProps = {
    user: UserRecord,
}

export default function UserBar({user}:UserBarProps) {
    const profilePictureSource: ImageSourcePropType = user.avatar ? { uri: pb.getFileUrl(user, user.avatar) } : require("assets/images/default-avatar.jpeg")
    //const colorScheme = Appearance.getColorScheme()
    
    return (
        <View style = {{height:60, justifyContent: 'center', borderWidth:1,}}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={profilePictureSource}
              style={{ width: 50, height: 50, borderRadius: 25, marginLeft:5}}
            />
            <Text style={{ marginLeft: 10, fontSize: 15, }}>{user.username}</Text>
          </View>
        </View>
    );
}