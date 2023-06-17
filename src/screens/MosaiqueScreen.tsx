import { useState } from "react";
import { Text } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, PinchGesture } from "react-native-gesture-handler";

// This component will be used to render an infinite canvas to which images can be added in a grid layout
export default function MosaiqueScreen() {
    const [scale, setScale] = useState<number>(1)

    const pinchGesture: PinchGesture = Gesture.Pinch().onUpdate(({ scale }) => {
        setScale(scale)
    })

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={pinchGesture}>
                <Text>{scale}</Text>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}