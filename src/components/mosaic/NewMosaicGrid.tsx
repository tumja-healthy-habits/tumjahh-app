import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { pb, useRealTimeSubscription } from "src/pocketbaseService";
import { ContainsRecord, MosaicRecord, PhotosRecord } from "types";
import NavigatableView from "./NavigatableView";
import NewMosaicTile from "./NewMosaicTile";

const MIN_ZOOM: number = 0.2
const MAX_ZOOM: number = 3

type NewMosaicGridProps = {
    mosaicRecord: MosaicRecord,
}

export default function NewMosaicGrid({ mosaicRecord }: NewMosaicGridProps) {
    const [photos, setPhotos] = useState<PhotosRecord[]>([])

    const numRings: number = Math.max(Math.ceil((Math.sqrt(photos.length) - 1) / 2), 1)
    const gridSize: number = 2 * numRings + 1

    const zoom: number = 0.66

    useEffect(() => {
        // load the photos that are in the mosaic and read them into a grid
        pb.collection("contains").getFullList<ContainsRecord>({
            filter: `mosaic_id = "${mosaicRecord.id}"`, // only get photos for this mosaic
            expand: "photo_id", // expand the photo_id field to get the photo record
            sort: "-created"
        }).then((records: ContainsRecord[]) => {
            setPhotos(records.map((record: ContainsRecord) => record.expand.photo_id))
        })
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

    function generateSpiral(): (PhotosRecord & { latest: number } | undefined)[][] {
        if (photos.length === 0) return []
        const grid: (PhotosRecord & { latest: number } | undefined)[][] = Array(gridSize).fill(undefined).map(() => Array(gridSize).fill(undefined))
        let x: number = 0
        let y: number = 0
        let dx: number = 0
        let dy: number = -1
        photos.forEach((photo: PhotosRecord, i: number) => {
            grid[x + numRings][y + numRings] = (i < 1 ? { ...photo, latest: i } : photo) as PhotosRecord & { latest: number }
            if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
                [dx, dy] = [-dy, dx]
            }
            [x, y] = [x + dx, y + dy]
        })
        return grid
    }

    return <NavigatableView minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM} initialZoom={zoom} style={styles.container}>
        <View style={styles.grid}>
            {generateSpiral().map((row: (PhotosRecord & { latest: number } | undefined)[], i: number) =>
                <View key={i} style={styles.row}>
                    {row.map((photo: PhotosRecord & { latest: number } | undefined, j: number) =>
                        <NewMosaicTile key={j} photo={photo} latest={photo?.latest} />)}
                </View>
            )}
        </View>
    </NavigatableView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
    },
    grid: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    }
})