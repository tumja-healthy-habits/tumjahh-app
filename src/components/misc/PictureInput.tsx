import {View, Image, Text, StyleSheet,} from "react-native"
import { ImagePickerResult, MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import IconButton from "./IconButton";
import { FixedDimensionImage } from 'types';
import { ImageSourcePropType } from "deprecated-react-native-prop-types";



type PictureInputProps = {
	onTakePhoto: (photo: FixedDimensionImage) => void,
	picture?: FixedDimensionImage,
    defaultPicture: ImageSourcePropType,
    imageStyle?: any,
    label: string,
    iconSize: number,
    labelStyle?:any,
    style?:any,
    iconColor?:string,
    iconStyle?:any,
}

export default function PictureInput({onTakePhoto, picture, defaultPicture, imageStyle, label, labelStyle, iconSize, style, iconColor="white", iconStyle}:PictureInputProps) {

	async function openMediaLibrary(): Promise<void> {
        launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            allowsMultipleSelection: false,
			aspect: [1, 1] //for android, on ios the crop rectangle is always a square
        }).then((result: ImagePickerResult) => {
            if (result.canceled) return
            onTakePhoto(result.assets[0])
        })
    }
	return( 
		<View style={[styles.pictureContainer, style]}>
			<Text style={labelStyle}>{label}</Text>
			<View style={styles.pictureContainer}>
				<Image
					source={picture ? {uri: picture!.uri} : defaultPicture} //require("assets/images/default-avatar.png")}
					//style={{width:100, height:100, opacity:0.5, borderRadius:8}}
                    style={[imageStyle, {opacity:0.7, borderRadius:8}]}
				/>
				<View style={styles.overlay}>
					<IconButton icon="image-outline" color={iconColor} onPress={openMediaLibrary} size={iconSize} style={iconStyle} />
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
    pictureContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	  },
})