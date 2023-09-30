import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Image, Pressable, StyleSheet, View } from "react-native"
import { useMosaiqueData } from "src/store/MosaiqueDataProvider"
import { AppParamList } from "./LoggedInApp"

type MosaiqueTileProps = {
    x: number
    y: number
}

export default function MosaiqueTile({ x, y }: MosaiqueTileProps) {
    const { getImageUri, putImage } = useMosaiqueData()
    const { params } = useRoute<RouteProp<AppParamList, "Mosaique">>()
    const navigation = useNavigation<NavigationProp<AppParamList, "Mosaique">>()

    function handlePress(): void {
        if (params === undefined || params.imageUri === undefined) return
        putImage(x, y, params.imageUri)
        navigation.navigate("Mosaique", {
            imageUri: undefined,
        })
    }

    const uri: string = getImageUri(x, y)

    return uri ? (
        <View style={styles.container}>
            <Image source={{ uri: uri }} style={styles.image} />
        </View>
    ) : (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [styles.container, styles.empty, pressed && styles.pressed]}>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 200,
        margin: 0,
    },
    empty: {
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 0,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    pressed: {
        opacity: 1,
        borderColor: "blue",
        backgroundColor: "white",
    }
})