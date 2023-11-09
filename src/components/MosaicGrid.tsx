import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useMosaicData } from "src/store/MosaicDataProvider";
import FloatingPicture from "./FloatingPicture";
import { AppParamList } from "./LoggedInApp";
import MosaicTile from "./MosaicTile";

export default function MosaicGrid() {
    const { numRings } = useMosaicData()
    const gridSize: number = 2 * numRings + 1
    const { params } = useRoute<RouteProp<AppParamList, "Mosaic">>()

    const getIndices = useCallback(
        function (i: number, j: number) {
            return [i - numRings, j - numRings]
        }, [numRings]
    )

    return (
        <View style={styles.container}>
            {params && params.imageUri && <FloatingPicture imageUri={params.imageUri} />}
            {
                Array.from({ length: gridSize }).map((_: any, rowIndex: number) => (
                    <View style={styles.row} key={rowIndex}>
                        {Array.from({ length: gridSize }).map((_, columnIndex) => {
                            const [i, j] = getIndices(columnIndex, rowIndex)
                            return (
                                <MosaicTile
                                    key={columnIndex}
                                    x={i}
                                    y={j}
                                />
                            )
                        }
                        )}
                    </View>
                ))
            }
        </View>
    )
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