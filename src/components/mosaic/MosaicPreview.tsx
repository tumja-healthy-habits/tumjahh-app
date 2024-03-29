import { NavigationProp, useNavigation } from "@react-navigation/native";
import Colors from "constants/colors";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Chip } from "react-native-paper";
import { MosaicParamList } from "screens/mosaic/MosaicNavigator";
import { pb, useRealTimeSubscription } from "src/pocketbaseService";
import { ContainsRecord, MosaicRecord } from "types";


type MosaicPreviewProps = {
    record: MosaicRecord,
}

export default function MosaicPreview({ record }: MosaicPreviewProps) {
    const { navigate } = useNavigation<NavigationProp<MosaicParamList, "List">>()
    const [numPhotos, setNumPhotos] = useState<number>(0)

    useEffect(() => {
        pb.collection("contains").getFullList<ContainsRecord>({
            filter: `mosaic_id = "${record.id}"`,
        }).then((contains: ContainsRecord[]) => {
            setNumPhotos(contains.length)
        }).catch((error) => console.error("An error occured while fetching the number of photos in the mosaic", error))
    }, [record.id])

    useRealTimeSubscription<ContainsRecord>("contains", {
        onCreate: (contains: ContainsRecord) => {
            if (contains.mosaic_id === record.id) setNumPhotos((numPhotos: number) => numPhotos + 1)
        },
        onDelete: (contains: ContainsRecord) => {
            if (contains.mosaic_id === record.id) setNumPhotos((numPhotos: number) => numPhotos - 1)
        },
    })


    function handlePress(): void {
        navigate("SingleMosaic", { mosaicId: record.id })
    }

    return (
        <View>
            <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={handlePress}>
                {({ pressed }) =>
                (<>{record.thumbnail === "" ? <View style={styles.image} /> : <Image source={{ uri: pb.getFileUrl(record, record.thumbnail) }} style={styles.image} />}
                    <View style={[styles.innerContainer, pressed && { backgroundColor: Colors.pastelOrange }]}>
                        <Text style={[styles.title, pressed && { color: Colors.white }]}>{record.name}</Text>
                        {numPhotos !== undefined && <Chip>{numPhotos}</Chip>}
                    </View></>)
                }
            </Pressable>
        </View>
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
        marginLeft: 10
    },
    image: {
        width: "100%",
        height: 330,
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
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        //position:"absolute",
        //top:10,
        marginTop: 15,
        marginLeft: "86%",
    },
})