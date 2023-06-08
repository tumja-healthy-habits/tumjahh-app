import { View, StyleSheet, StyleProp, ViewStyle } from "react-native"

type ContentBoxProps = {
    children: React.ReactNode,
    style?: StyleProp<ViewStyle>,
}

export default function ContentBox({ children, style }: ContentBoxProps) {

    return (
        <View style={[styles.container, style]}>
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
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
    },
})