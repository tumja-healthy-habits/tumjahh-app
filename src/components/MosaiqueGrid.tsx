import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useMosaiqueData } from "src/store/MosaiqueDataProvider";
import MosaiqueTile from "./MosaiqueTile";

export default function MosaiqueGrid() {
    const { numRings } = useMosaiqueData()
    const gridSize: number = 2 * numRings + 1

    const getIndices = useCallback(
        function (i: number, j: number) {
            return [i - numRings, j - numRings]
        }, [numRings]
    )

    return (
        <View style={styles.container}>
            {
                Array.from({ length: gridSize }).map((_: any, rowIndex: number) => (
                    <View style={styles.row} key={rowIndex}>
                        {Array.from({ length: gridSize }).map((_, columnIndex) => {
                            const [i, j] = getIndices(columnIndex, rowIndex)
                            return (
                                <MosaiqueTile
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