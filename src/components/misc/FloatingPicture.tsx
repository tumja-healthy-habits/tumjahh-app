import React, { useEffect } from "react"
import { Image, StyleSheet } from "react-native"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated"

type FloatingPictureProps = {
    imageUri: string
}

export default function FloatingPicture({ imageUri }: FloatingPictureProps) {
    const rotation = useSharedValue(-5)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }))

    useEffect(() => {
        rotation.value = withRepeat(withTiming(5), -1, true)
    }, [])

    return (
        <Animated.View style={[styles.container, animatedStyle]} sharedTransitionTag="sharedTag">
            <Image source={{ uri: imageUri }} style={styles.image} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: "black",
        shadowOffset: { width: 50, height: 50 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 200,
        margin: 0,
        paddingTop: -36,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
})
