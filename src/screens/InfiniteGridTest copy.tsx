import { useState } from "react";
import { View, Text, Pressable, ViewProps, Button, Dimensions } from "react-native";
import { ComposedGesture, Gesture, GestureDetector, GestureHandlerRootView, PanGesture, PinchGesture } from "react-native-gesture-handler";
import Animated, { AnimateProps, SharedValue, runOnJS, runOnUI, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";

function GridTile({ index }: any) {
    return <Pressable
        onPress={() => console.log("pressed ", index)}
        style={({ pressed }) => [{ borderWidth: 2, borderColor: "black", width: 200, height: 200, justifyContent: "center", alignItems: "center" }, pressed && { opacity: 1, borderColor: "blue", backgroundColor: "white" }]}>
        <Text>{index}</Text>
    </Pressable>
}

const MIN_ZOOM: number = 0.2
const MAX_ZOOM: number = 3
const INITIAL_GRID_SIZE: number = 5

export default function InfiniteGridTestCopy() {
    const xOff: SharedValue<number> = useSharedValue(0)
    const savedXOff: SharedValue<number> = useSharedValue(0)
    const yOff: SharedValue<number> = useSharedValue(0)
    const savedYOff: SharedValue<number> = useSharedValue(0)
    const scale: SharedValue<number> = useSharedValue(1)
    const savedScale: SharedValue<number> = useSharedValue(1)

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
        <GestureHandlerRootView>
            <GestureDetector gesture={navigateGridGesture}>
                <Animated.View style={[animatedStyles]}>
                    <FasterGrid scale={scale} />
                    <Button title="Reset" onPress={runOnUI(() => {
                        savedXOff.value = 0
                        savedYOff.value = 0
                        savedScale.value = 1
                    })} />
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}

function Grid({ scale }: { scale: SharedValue<number> }) {
    const [gridSize, setGridSize] = useState<number>(5)
    useAnimatedReaction(() => {
        return Math.ceil(INITIAL_GRID_SIZE / scale.value) !== gridSize
    }, () => {
        runOnJS(setGridSize)(Math.ceil(INITIAL_GRID_SIZE / scale.value))
    })

    return (
        <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            {
                Array.from({ length: gridSize }).map((_: any, rowIndex: number) => (
                    <View style={{ flexDirection: 'row' }} key={rowIndex}>
                        {Array.from({ length: gridSize }).map((_, columnIndex) => (
                            <GridTile
                                key={columnIndex}
                                index={rowIndex * gridSize + columnIndex}
                            />
                        ))}
                    </View>
                ))
            }
        </View>
    )
}

function FasterGrid({ scale }: { scale: SharedValue<number> }) {
    const [gridSize, setGridSize] = useState<number>(5);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: gridSize });

    useAnimatedReaction(
        () => Math.ceil(INITIAL_GRID_SIZE / scale.value),
        (newGridSize) => {
            runOnJS(setGridSize)(newGridSize);
        }
    );

    useAnimatedReaction(
        () => {
            return {
                scale: scale.value,
                gridSize,
                visibleRange,
            };
        },
        ({ scale: animatedScale, gridSize: animatedGridSize, visibleRange: animatedVisibleRange }) => {
            const newVisibleRange = calculateVisibleRange(animatedScale, animatedGridSize, animatedVisibleRange);
            (setVisibleRange)(newVisibleRange);
        },
        [gridSize, scale]
    );

    const windowWidth = Dimensions.get('window').width;
    // Adjust the value based on your specific viewport dimensions

    const calculateVisibleRange = (
        scale: number,
        gridSize: number,
        visibleRange: { start: number; end: number }
    ) => {
        const tileWidth = 200 * scale; // Adjust the tile width based on the scale

        const startIndex = Math.max(Math.floor(visibleRange.start - 1), 0);
        const endIndex = Math.min(Math.ceil(visibleRange.end + 1), gridSize);

        let totalWidth = 0;
        let newStartIndex = startIndex;
        let newEndIndex = endIndex;

        for (let i = startIndex; i < endIndex; i++) {
            totalWidth += tileWidth;

            if (totalWidth > windowWidth) {
                newEndIndex = i + 1;
                break;
            }
        }

        totalWidth = 0;

        for (let i = endIndex - 1; i >= startIndex; i--) {
            totalWidth += tileWidth;

            if (totalWidth > windowWidth) {
                newStartIndex = i;
                break;
            }
        }

        return { start: newStartIndex, end: newEndIndex };
    };

    return (
        <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            {Array.from({ length: gridSize }).map((_, rowIndex: number) => {
                if (rowIndex < visibleRange.start || rowIndex >= visibleRange.end) {
                    return null; // Skip rendering tiles outside the visible range
                }

                return (
                    <View style={{ flexDirection: 'row' }} key={rowIndex}>
                        {Array.from({ length: gridSize }).map((_, columnIndex) => {
                            if (columnIndex < visibleRange.start || columnIndex >= visibleRange.end) {
                                return null; // Skip rendering tiles outside the visible range
                            }

                            return (
                                <GridTile
                                    key={columnIndex}
                                    index={rowIndex * gridSize + columnIndex}
                                />
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
}
