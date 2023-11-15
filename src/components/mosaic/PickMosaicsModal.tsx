import { useEffect, useState } from "react"
import { ListRenderItemInfo, Modal, SafeAreaView } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { FlatList } from "react-native-gesture-handler"
import { Button } from "react-native-paper"
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
        pb.collection("mosaics").getFullList<MosaicRecord>().then(setMosaics)
    }, [])

    function renderMosaicOption({ item: mosaic }: ListRenderItemInfo<MosaicRecord>) {
        return <BouncyCheckbox
            text={mosaic.name}
            iconStyle={{ borderColor: "lightgray", borderRadius: 5 }}
            fillColor="lightgray"
            onPress={() => {
                if (selectedMosaics.includes(mosaic)) {
                    setSelectedMosaics(selectedMosaics.filter((selectedMosaic: MosaicRecord) => selectedMosaic !== mosaic))
                } else {
                    setSelectedMosaics([...selectedMosaics, mosaic])
                }
            }}
            isChecked={selectedMosaics.includes(mosaic)}
            textStyle={{ textDecorationLine: "none" }}
        />
    }

    function handleSubmit() {
        console.log("selected mosaics", selectedMosaics)
        if (photoId === undefined) return
        Promise.all(selectedMosaics.map((mosaic: MosaicRecord) => pb.collection("contains").create({
            mosaic_id: mosaic.id,
            photo_id: photoId,
            x: 0,
            y: 0,
        }))).then(() => {
            if (onClose) onClose()
        })
    }

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView>
                <FlatList
                    data={mosaics}
                    keyExtractor={(mosaic: MosaicRecord) => mosaic.id}
                    renderItem={renderMosaicOption}
                />
                <Button onPress={handleSubmit}>
                    Add your photo
                </Button>
            </SafeAreaView>
        </Modal>
    )
}