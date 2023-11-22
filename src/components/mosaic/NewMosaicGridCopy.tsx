import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Extrapolate, interpolate } from "react-native-reanimated";
import { pb, useRealTimeSubscription } from "src/pocketbaseService";
import { ContainsRecord, MosaicRecord, PhotosRecord } from "types";
import NavigatableView from "./NavigatableView";
import NewMosaicTile from "./NewMosaicTile";

const MIN_ZOOM: number = 0.2
const MAX_ZOOM: number = 3

type NewMosaicGridProps = {
    mosaicId: string
}

export default function NewMosaicGridCopy({ mosaicId }: NewMosaicGridProps) {
    const [mosaicRecord, setMosaicRecord] = useState<MosaicRecord>()
    const [photos, setPhotos] = useState<PhotosRecord[]>([])

    const numRings: number = Math.ceil((Math.sqrt(photos.length) - 1) / 2)
    const gridSize: number = 2 * numRings + 1

    const zoom: number = interpolate(numRings, [0, 3], [MAX_ZOOM / 4, MIN_ZOOM], Extrapolate.CLAMP)

    useEffect(() => {
        // load the mosaic record and the photos that are in the mosaic and read them into a grid
        pb.collection("mosaics").getOne<MosaicRecord>(mosaicId).then((mosaicRecord: MosaicRecord) => {
            pb.collection("contains").getFullList<ContainsRecord>({
                filter: `mosaic_id = "${mosaicId}"`, // only get photos for this mosaic
                expand: "photo_id", // expand the photo_id field to get the photo record
                sort: "-created"
            }).then((records: ContainsRecord[]) => {
                setPhotos(records.map((record: ContainsRecord) => record.expand.photo_id))
            })
            setMosaicRecord(mosaicRecord)
        }).catch(console.error)
    }, [])

    useRealTimeSubscription<ContainsRecord>("contains", {
        onCreate: handleCreateContains,
        onDelete: handleDeleteContains,
    }, [mosaicRecord])

    function handleCreateContains(record: ContainsRecord): void {
        pb.collection("photos").getOne<PhotosRecord>(record.photo_id).then((photo: PhotosRecord) => {
            setPhotos((oldPhotos: PhotosRecord[]) => [photo, ...oldPhotos])
        })
    }

    function handleDeleteContains(record: ContainsRecord): void {
        setPhotos((oldPhotos: PhotosRecord[]) => oldPhotos.filter((photo: PhotosRecord) => photo.id !== record.photo_id))
    }

    if (mosaicRecord === undefined) {
        // Show an activity indicator while the mosaic record is loading
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        )
    }

    function generateSpiral(): (PhotosRecord | undefined)[][] {
        if (photos.length === 0) return []
        const grid: (PhotosRecord | undefined)[][] = Array(gridSize).fill(undefined).map(() => Array(gridSize).fill(undefined))
        let x: number = 0
        let y: number = 0
        let dx: number = 0
        let dy: number = -1
        for (let photo of photos) {
            grid[x + numRings][y + numRings] = photo
            if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
                [dx, dy] = [-dy, dx]
            }
            [x, y] = [x + dx, y + dy]
        }
        return grid
    }

    return <NavigatableView minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM} initialZoom={zoom} style={styles.container}>
        <View style={styles.grid}>
            {generateSpiral().map((row: (PhotosRecord | undefined)[], i: number) =>
                <View key={i} style={styles.row}>
                    {row.map((photo: PhotosRecord | undefined, j: number) =>
                        <NewMosaicTile key={j} photo={photo} />)}
                </View>
            )}
        </View>
    </NavigatableView>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    grid: {
        justifyContent: "center",
        alignItems: "center",
    }
})