import ActionButton from "components/misc/ActionButton";
import MosaicGrid from "components/mosaic/MosaicGrid";
import NavigatableView from "components/mosaic/NavigatableView";
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