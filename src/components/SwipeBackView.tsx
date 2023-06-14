import { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, GestureStateChangeEvent, GestureUpdateEvent, PanGesture, PanGestureHandlerEventPayload } from "react-native-gesture-handler";

const SWIPE_THRESHOLD: number = 100 // How many pixels the user must swipe to activate the effect

type SwipeBackViewProps = {
    onSwipeBack: () => void,
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
}

export default function SwipeBackView({ onSwipeBack, children, style }: SwipeBackViewProps) {
    const swipeGesture: PanGesture = Gesture.Pan().onEnd((event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
        if (event.translationX > SWIPE_THRESHOLD) {
            onSwipeBack()
        }
    })

    return (
        <GestureHandlerRootView style={style}>
            <GestureDetector gesture={swipeGesture}>
                {children}
            </GestureDetector>
        </GestureHandlerRootView>
    )
}