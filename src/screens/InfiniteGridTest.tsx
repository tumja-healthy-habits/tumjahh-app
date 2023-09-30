import { useState } from "react";
import { View, Text, Pressable, Animated as RNAnimated } from "react-native";
import { ComposedGesture, Gesture, GestureDetector, GestureHandlerRootView, PanGesture, PinchGesture } from "react-native-gesture-handler";
import Animated, { AnimateProps, SharedValue, useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";

function GridTile({ i }: any) {
    return <Pressable
        onPress={() => console.log("pressed ", i)}
        style={({ pressed }) => [{ borderWidth: 2, borderColor: "black", width: 200, height: 200, justifyContent: "center", alignItems: "center" }, pressed && { opacity: 1, borderColor: "blue", backgroundColor: "white" }]}>
        <Text>{i}</Text>
    </Pressable>
}

const MIN_ZOOM: number = 0.2
const MAX_ZOOM: number = 3

export default function InfiniteGridTest() {
    const xOff: SharedValue<number> = useSharedValue(0)
    const savedXOff: SharedValue<number> = useSharedValue(0)
    const yOff: SharedValue<number> = useSharedValue(0)
    const savedYOff: SharedValue<number> = useSharedValue(0)
    const scale: SharedValue<number> = useSharedValue(1)
    const savedScale: SharedValue<number> = useSharedValue(1)
    const grid: SharedValue<number[][]> = useDerivedValue(() => {
        const gridSize: number = Math.ceil(5 / scale.value)
        let tiles: number[][] = []
        for (let i = 0; i < gridSize; i++) {
            tiles.push([])
            for (let j = 0; j < gridSize; j++) {
                tiles[i].push(i * gridSize + j)
            }
        }
        console.log("updated tiles with gridSize ", gridSize)
        return tiles
    }, [scale])

    const [_, rerenderHack] = useState<undefined>()

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: xOff.value }, { translateY: yOff.value }, { scale: scale.value }]
        }
    })

    const panGesture: PanGesture = Gesture.Pan()
        .onUpdate(({ translationX, translationY }) => {
            xOff.value = savedXOff.value + translationX
            yOff.value = savedYOff.value + translationY
        })
        .onEnd(({ translationX, translationY }) => {
            savedXOff.value = savedXOff.value + translationX
            savedYOff.value = savedYOff.value + translationY

        })

    const pinchGesture: PinchGesture = Gesture.Pinch()
        .onUpdate(({ scale: eventScale }) => {
            scale.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, savedScale.value * eventScale))
        })
        .onEnd(({ scale: eventScale }) => {
            savedScale.value = savedScale.value * eventScale
        })

    const navigateGridGesture: ComposedGesture = Gesture.Simultaneous(panGesture, pinchGesture)

    return (
        <GestureHandlerRootView style={{ borderColor: "red", borderWidth: 3 }}>
            <GestureDetector gesture={navigateGridGesture}>
                <Animated.View style={[animatedStyles]}>
                    {grid.value.map((row: number[], rowIndex: number) =>
                        <View style={{ flexDirection: "row" }} key={rowIndex}>
                            {row.map((tile: number, tileIndex: number) => (
                                <GridTile i={tile} key={tileIndex} />
                            ))}
                        </View>)}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}