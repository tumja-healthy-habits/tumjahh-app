import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { pb, useRealTimeSubscription } from "src/pocketbaseService";
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider";
import { ContainsRecord, FixedDimensionImage, MosaicRecord, PhotosRecord } from "types";
import NewMosaicTile from "./NewMosaicTile";

type NewMosaicGridProps = {
    mosaicId: string
}

type PhotoGrid = {
    [key: number]: {
        [key: number]: PhotosRecord | undefined
    }
}

function emptyGrid(numRings: number): PhotoGrid {
    const grid: PhotoGrid = {}
    for (let i = 0; i < 2 * numRings + 1; i++) {
        grid[i] = {}
        for (let j = 0; j < 2 * numRings + 1; j++) {
            grid[i][j] = undefined
        }
    }
    return grid
}

export default function NewMosaicGrid({ mosaicId }: NewMosaicGridProps) {
    const [mosaicRecord, setMosaicRecord] = useState<MosaicRecord>()
    const [photoGrid, setPhotoGrid] = useState<PhotoGrid>({})

    const { currentUser } = useAuthenticatedUser()


    useEffect(() => {
        // load the mosaic record and the photos that are in the mosaic and read them into a grid
        pb.collection("mosaics").getOne<MosaicRecord>(mosaicId).then((mosaicRecord: MosaicRecord) => {
            pb.collection("contains").getFullList<ContainsRecord>({
                filter: `mosaic_id = "${mosaicId}"`, // only get photos for this mosaic
                expand: "photo_id", // expand the photo_id field to get the photo record
            }).then((records: ContainsRecord[]) => {
                const photoGrid: PhotoGrid = emptyGrid(mosaicRecord.numRings)
                records.forEach((record: ContainsRecord, _, __) => {
                    const [i, j] = getIndices(record.index_x, record.index_y, mosaicRecord.numRings)
                    photoGrid[i][j] = record.expand.photo_id
                })
                setPhotoGrid(photoGrid)
            }).catch(console.error)

            setMosaicRecord(mosaicRecord)
        }).catch(console.error)
    }, [])

    useRealTimeSubscription<ContainsRecord>("contains", {
        onCreate: handleCreateContains,
        onDelete: handleDeleteContains,
    }, [mosaicRecord])

    function handleCreateContains(record: ContainsRecord): void {
        if (mosaicRecord === undefined || record.mosaic_id !== mosaicId) {
            console.log("handleCreateContains: not this mosaic")
            return
        }
        const [i, j] = getIndices(record.index_x, record.index_y, mosaicRecord.numRings)
        pb.collection("photos").getOne<PhotosRecord>(record.photo_id).then((photoRecord: PhotosRecord) => {
            setPhotoGrid((oldPhotoGrid: PhotoGrid) => {
                const newPhotoGrid: PhotoGrid = { ...oldPhotoGrid }
                newPhotoGrid[i][j] = photoRecord
                console.log("newPhotoGrid", newPhotoGrid)
                return newPhotoGrid
            })
        }).catch(console.error)
    }

    function handleDeleteContains(record: ContainsRecord): void {
        if (mosaicRecord === undefined || record.mosaic_id !== mosaicId) {
            console.log("handleDeleteContains: not this mosaic")
            return
        }
        const [i, j] = getIndices(record.index_x, record.index_y, mosaicRecord.numRings)
        setPhotoGrid((oldPhotoGrid: PhotoGrid) => {
            const newPhotoGrid: PhotoGrid = { ...oldPhotoGrid }
            newPhotoGrid[i][j] = undefined
            console.log("newPhotoGrid", newPhotoGrid)
            return newPhotoGrid
        })
    }

    if (mosaicRecord === undefined) {
        // Show an activita indicator while the mosaic record is loading
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        )
    }

    const gridSize: number = 2 * mosaicRecord.numRings + 1

    // compute the indices of the photo in the grid from the position of the photo in the database
    function getIndices(x: number, y: number, numRings: number) {
        return [x + numRings, y + numRings]
    }

    function putImage(i: number, j: number, photo: FixedDimensionImage): void {
        if (currentUser === null || mosaicRecord === undefined) return
        setPhotoGrid((oldPhotoGrid: PhotoGrid | undefined) => {
            const newPhotoGrid: PhotoGrid = { ...oldPhotoGrid }
            if (newPhotoGrid[i] === undefined) {
                newPhotoGrid[i] = {}
            }
            pb.collection("photos").create<PhotosRecord>({
                uri: photo.uri,
                user_id: currentUser.id,
                height: photo.height,
                width: photo.width,
            }).then((photoRecord: PhotosRecord) => {
                newPhotoGrid[i][j] = photoRecord
                pb.collection("contains").create<ContainsRecord>({
                    mosaic_id: mosaicId,
                    photo_id: photoRecord.id,
                    index_x: i - mosaicRecord.numRings,
                    index_y: j - mosaicRecord.numRings,
                })
            }).catch(console.error)
            return newPhotoGrid
        })
    }

    return <View style={styles.container}>
        {
            Array.from({ length: gridSize }).map((_: any, columnIndex: number) =>
                <View style={styles.row} key={columnIndex}>
                    {Array.from({ length: gridSize }).map((_, rowIndex) => {
                        return (
                            <NewMosaicTile
                                key={rowIndex}
                                putImage={(photo: FixedDimensionImage) => putImage(rowIndex, columnIndex, photo)}
                                photo={photoGrid[rowIndex] && photoGrid[rowIndex][columnIndex]}
                            />
                        )
                    }
                    )}
                </View>
            )
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: 'row'
    },
})