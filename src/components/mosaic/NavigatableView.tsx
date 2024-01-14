import { useEffect } from "react"
import { LayoutChangeEvent, StyleProp, View, ViewStyle, useWindowDimensions } from "react-native"
import { ComposedGesture, Gesture, GestureDetector, PanGesture, PinchGesture } from "react-native-gesture-handler"
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { pb } from "src/pocketbaseService"
import { PhotosRecord } from "types"

type NavigatableViewProps = {
    minZoom: number,
    maxZoom: number,
    initialZoom?: number,
    contentWidth?: number,
    contentHeight?: number,
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
}

export default function NavigatableView({ minZoom, maxZoom, initialZoom, contentWidth, contentHeight, children, style }: NavigatableViewProps) {
    const xOff: SharedValue<number> = useSharedValue(0)
    const savedXOff: SharedValue<number> = useSharedValue(0)
    const yOff: SharedValue<number> = useSharedValue(0)
    const savedYOff: SharedValue<number> = useSharedValue(0)
    const scale: SharedValue<number> = useSharedValue(initialZoom || 1)
    const savedScale: SharedValue<number> = useSharedValue(initialZoom || 1)

    const focalX: SharedValue<number> = useSharedValue(0)
    const focalY: SharedValue<number> = useSharedValue(0)

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

    const viewWidth: SharedValue<number> = useSharedValue(0)
    const viewHeight: SharedValue<number> = useSharedValue(0)


    function onViewLayout(event: LayoutChangeEvent): void {
        const { width, height } = event.nativeEvent.layout
        console.log("view layout changed to " + width + "x" + height)
        viewWidth.value = width
        viewHeight.value = height
    }

    function test(): void {
        pb.collection("photos").create<PhotosRecord>({
            name: "test",
            description: "test",
            photo: "test",
            userId: "test",
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }


    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                // { translateX: xOff.value }, { translateY: yOff.value },
                { translateX: focalX.value }, { translateY: focalY.value },
                { translateX: -windowWidth / 2 }, { translateY: -windowHeight / 2 },
                { scale: scale.value },
                { translateX: windowWidth / 2 }, { translateY: windowHeight / 2 },
                { translateX: -focalX.value }, { translateY: -focalY.value },
            ]
        }
    })

    const panGesture: PanGesture = Gesture.Pan()
        .onUpdate(({ translationX, translationY }) => {
            let newXOff: number = savedXOff.value + translationX
            let newYoff: number = savedYOff.value + translationY

            if (contentWidth !== undefined) {
                const maxX: number = (contentWidth * scale.value - viewWidth.value) / 2
                const minX: number = -maxX
                newXOff = Math.max(minX, Math.min(maxX, newXOff))
            }

            if (contentHeight !== undefined) {
                const maxY: number = (contentHeight * scale.value - viewHeight.value) / 2
                const minY: number = -maxY
                newYoff = Math.max(minY, Math.min(maxY, newYoff))
            }

            xOff.value = newXOff
            yOff.value = newYoff
        })
        .onEnd(({ translationX, translationY }) => {
            savedXOff.value = xOff.value
            savedYOff.value = yOff.value
        })

    const pinchGesture: PinchGesture = Gesture.Pinch()
        .onUpdate(({ scale: eventScale, focalX: eventFocalX, focalY: eventFocalY }) => {
            scale.value = Math.max(minZoom, Math.min(maxZoom, savedScale.value * eventScale))
            focalX.value = eventFocalX
            focalY.value = eventFocalY
        })
        .onEnd(({ scale: eventScale }) => {
            savedScale.value = scale.value
        })

    const navigateGridGesture: ComposedGesture = Gesture.Simultaneous(panGesture, pinchGesture)

    const focalPointStyle = useAnimatedStyle(() => {
        return {
            width: 10,
            height: 10,
            backgroundColor: "blue",
            position: "absolute",
            left: 0,
            top: 0,
            transform: [{ translateX: focalX.value }, { translateY: focalY.value }]
        }
    })

    return (
        <View style={{
            flex: 1, overflow: "hidden",
            // borderColor: "red", borderWidth: 2,
        }}>
            <GestureDetector gesture={navigateGridGesture}>
                <Animated.View style={{
                    width: windowHeight,
                    height: windowHeight,
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 1,
                }} />
            </GestureDetector>
            <Animated.View
                onLayout={onViewLayout}
                style={[style, animatedStyles, { flex: 1 }]}>
                {children}
            </Animated.View>
            <Animated.View style={[focalPointStyle]} />
        </View>
    )

}