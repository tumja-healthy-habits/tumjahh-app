import { useEffect } from "react"
import { StyleProp, ViewStyle, useWindowDimensions } from "react-native"
import { ComposedGesture, Gesture, GestureDetector, GestureHandlerRootView, PanGesture, PinchGesture } from "react-native-gesture-handler"
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

type NavigatableViewProps = {
    minZoom: number,
    maxZoom: number,
    initialZoom?: number,
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
}

export default function NavigatableView({ minZoom, maxZoom, initialZoom, children, style }: NavigatableViewProps) {
    const xOff: SharedValue<number> = useSharedValue(0)
    const savedXOff: SharedValue<number> = useSharedValue(0)
    const yOff: SharedValue<number> = useSharedValue(0)
    const savedYOff: SharedValue<number> = useSharedValue(0)
    const scale: SharedValue<number> = useSharedValue(initialZoom || 1)
    const savedScale: SharedValue<number> = useSharedValue(initialZoom || 1)

    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    useEffect(() => {
        if (initialZoom) {
            scale.value = initialZoom
            savedScale.value = initialZoom
        }
    }, [initialZoom])

    useEffect(() => {
        console.log("scale changed to " + scale.value)
    }, [scale.value])


    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: xOff.value }, { translateY: yOff.value }, { scale: scale.value }],
            // width: windowWidth / scale.value,
            // height: windowHeight / scale.value,
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
            scale.value = Math.max(minZoom, Math.min(maxZoom, savedScale.value * eventScale))
        })
        .onEnd(({ scale: eventScale }) => {
            savedScale.value = savedScale.value * eventScale
        })

    const navigateGridGesture: ComposedGesture = Gesture.Simultaneous(panGesture, pinchGesture)

    return (
        <GestureHandlerRootView style={{ flex: 1, overflow: "hidden" }}>
            <GestureDetector gesture={navigateGridGesture}>
                <Animated.View style={[style, animatedStyles]}>
                    {children}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    )

}