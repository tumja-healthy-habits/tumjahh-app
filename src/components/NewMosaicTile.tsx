import { Image, Pressable, StyleSheet, View } from "react-native";
import { pb } from "src/pocketbaseService";
import { FixedDimensionImage, PhotosRecord } from "types";

type NewMosaicTileProps = {
    putImage: (photo: FixedDimensionImage) => void,
    photo?: PhotosRecord,
}

export default function NewMosaicTile({ photo, putImage }: NewMosaicTileProps) {

    function handlePress(): void {
        if (photo === undefined) return
        // putImage(...) TODO: get params
    }

    return photo ? (
        <View style={styles.container}>
            <Image source={{ uri: pb.getFileUrl(photo, photo.photo) }} style={styles.image} />
        </View>
    ) : (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [styles.container, styles.empty, pressed && styles.pressed]}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 200,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    empty: {
        borderColor: "black",
        borderWidth: 0,
    },
    pressed: {
        opacity: 1,
        borderColor: "blue",
    }
})