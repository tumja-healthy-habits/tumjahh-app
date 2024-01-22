import { useEffect, useState } from "react"
import { Image, ListRenderItemInfo, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { FlatList } from "react-native-gesture-handler"
import { Button, Divider } from "react-native-paper"
import { pb } from "src/pocketbaseService"
import { MosaicRecord } from "types"

type PickMosaicsProps = {
    visible: boolean,
    photoId?: string,
    onClose?: () => void,
}

export default function PickMosaicsModal({ visible, photoId, onClose }: PickMosaicsProps) {
    const [mosaics, setMosaics] = useState<MosaicRecord[]>([])
    const [selectedMosaics, setSelectedMosaics] = useState<MosaicRecord[]>([])

    useEffect(() => {
        pb.collection("mosaics").getFullList<MosaicRecord>().then((mosaics: MosaicRecord[]) => {
            setMosaics(mosaics)
            setSelectedMosaics(mosaics)
        })
    }, [])

    function renderMosaicOption({ item: mosaic }: ListRenderItemInfo<MosaicRecord>) {
        function selectMosaic(): void {
            console.log("pressed", selectedMosaics)
            if (selectedMosaics.includes(mosaic)) {
                setSelectedMosaics(selectedMosaics.filter((selectedMosaic: MosaicRecord) => selectedMosaic !== mosaic))
            } else {
                setSelectedMosaics([...selectedMosaics, mosaic])
            }
        }

        return <Pressable style={styles.container} onPress={selectMosaic}>
            <Image source={{ uri: pb.getFileUrl(mosaic, mosaic.thumbnail) }} style={styles.image} />
            <View style={styles.innerContainer}>
                <Text style={styles.name}>{mosaic.name}</Text>
            </View>
            <BouncyCheckbox
                iconStyle={{ borderColor: "lightgray", borderRadius: 5 }}
                fillColor="lightgray"
                onPress={selectMosaic}
                isChecked={selectedMosaics.includes(mosaic)}
                textStyle={{ textDecorationLine: "none" }}
            />
        </Pressable>
    }

    function handleSubmit() {
        console.log("selected mosaics", selectedMosaics)
        if (photoId === undefined) return
        Promise.all(selectedMosaics.map((mosaic: MosaicRecord) => pb.collection("contains").create({
            mosaic_id: mosaic.id,
            photo_id: photoId,
        }))).then(() => {
            if (onClose) onClose()
        })
    }

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView>
                <View style={{ borderRadius: 10, backgroundColor: "white", borderColor: "lightgray", borderWidth: 1, margin: 15 }}>
                    <FlatList
                        data={mosaics}
                        keyExtractor={(mosaic: MosaicRecord) => mosaic.id}
                        renderItem={renderMosaicOption}
                        ItemSeparatorComponent={Divider}
                    />
                </View>
                <Button onPress={handleSubmit}>
                    Add your photo
                </Button>
                <Button onPress={onClose}>
                    Skip
                </Button>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    innerContainer: {
        flex: 1,
        marginLeft: 30,
        justifyContent: "center",
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    username: {
        fontSize: 14,
        marginBottom: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
})