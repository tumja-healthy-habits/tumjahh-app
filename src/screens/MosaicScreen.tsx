import ActionButton from "components/ActionButton";
import MosaicGrid from "components/MosaicGrid";
import NavigatableView from "components/NavigatableView";
import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { Extrapolate, interpolate } from "react-native-reanimated";
import { useMosaicData } from "src/store/MosaicDataProvider";

const MIN_ZOOM: number = 0.2
const MAX_ZOOM: number = 3

export default function MosaicScreen() {
    const { numRings, deleteMosaic } = useMosaicData()

    const zoom: number = useMemo(() => {
        return interpolate(numRings, [0, 3], [MAX_ZOOM / 4, MIN_ZOOM], Extrapolate.CLAMP)
    }, [numRings])

    return <View style={{}}>
        {numRings !== undefined ? <NavigatableView minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM} initialZoom={zoom}>
            <MosaicGrid />
            <ActionButton title="Reset" onPress={deleteMosaic} />
        </NavigatableView> : <ActivityIndicator />}
    </View>
}

// function Grid({ scale }: { scale: SharedValue<number> }) {
//     const [gridSize, setGridSize] = useState<number>(5)
//     useAnimatedReaction(() => {
//         return Math.ceil(INITIAL_GRID_SIZE / scale.value) !== gridSize
//     }, () => {
//         runOnJS(setGridSize)(Math.ceil(INITIAL_GRID_SIZE / scale.value))
//     })

//     return (
//         <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
//             {
//                 Array.from({ length: gridSize }).map((_: any, rowIndex: number) => (
//                     <View style={{ flexDirection: 'row' }} key={rowIndex}>
//                         {Array.from({ length: gridSize }).map((_, columnIndex) => (
//                             <GridTile
//                                 key={columnIndex}
//                                 index={rowIndex * gridSize + columnIndex}
//                             />
//                         ))}
//                     </View>
//                 ))
//             }
//         </View>
//     )
// }