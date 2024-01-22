import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

type ContentBoxProps = {
    children: React.ReactNode,
    shadow?: boolean,
    style?: StyleProp<ViewStyle>,
}

export default function ContentBox({ children, shadow, style }: ContentBoxProps) {
    return (
        <View style={[styles.container, (shadow === undefined || shadow) && styles.shadow, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: "black",
        padding: 15,
        margin: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        elevation: 5,
    }
})