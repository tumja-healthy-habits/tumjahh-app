import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Chip } from "react-native-paper";
import { MosaicParamList } from "screens/MosaicNavigator";
import { pb } from "src/pocketbaseService";
import { MosaicRecord } from "types";

type MosaicPreviewProps = {
    record: MosaicRecord,
}

export default function MosaicPreview({ record }: MosaicPreviewProps) {
    const { navigate } = useNavigation<NavigationProp<MosaicParamList, "List">>()

    function handlePress(): void {
        navigate("Mosaic", { mosaicId: record.id })
    }

    return (
        <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={handlePress}>
            {({ pressed }) =>
            (<>{record.thumbnail === "" ? <View style={styles.image} /> : <Image source={{ uri: pb.getFileUrl(record, record.thumbnail) }} style={styles.image} />}
                <View style={[styles.innerContainer, pressed && { backgroundColor: Colors.pastelOrange }]}>
                    <Text style={[styles.title, pressed && { color: Colors.white }]}>{record.name}</Text>
                    <Chip>5</Chip>
                </View></>)
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: Colors.pastelGreen,
        margin: 10,
        borderRadius: 25,
        overflow: "hidden",
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.primaryDark,
        flex: 1,
    },
    image: {
        width: "100%",
        height: 250,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    innerContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: Colors.white,
        width: "100%",
        height: 50,
        paddingHorizontal: 20,
    },
    pressed: {
        backgroundColor: Colors.pastelGreen,
    }
})