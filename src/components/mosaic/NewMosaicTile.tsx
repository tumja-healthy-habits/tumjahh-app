import { Image, Pressable, StyleSheet, View } from "react-native";
import { pb } from "src/pocketbaseService";
import { PhotosRecord } from "types";

type NewMosaicTileProps = {
    photo?: PhotosRecord,
    latest?: number,
}

export default function NewMosaicTile({ photo, latest }: NewMosaicTileProps) {

    function handlePress(): void {
        if (photo === undefined) return
    }

    return photo ? (
        <View style={styles.container}>
            <Image
                source={{ uri: pb.getFileUrl(photo, photo.photo), cache: "force-cache" }}
                style={[styles.image, latest !== undefined && {
                    borderColor: `rgba(255, 200, 0, ${1 - latest / 8})`,
                    borderWidth: 6 - latest / 2,
                    // adapt the borders which are colored to display the spiral

                }]} />
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
    },
    latest: {
        borderColor: "yellow",
        borderWidth: 3,
    }
})