import Colors from 'constants/colors';
import { StyleSheet } from "react-native";

// styles
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hcontainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    lcontainer: {
        backgroundColor: '#d7c3de',
        height: '100%', 
        width: '100%',
        paddingTop: 50,
        alignItems: 'center'
    },
    textfieldText: {
        color: Colors.accent,
        fontSize: 18,
        textAlign: "center",
        margin: 5,
    },
    textfieldTitle: {
        color: Colors.accent,
        fontSize: 30,
        textAlign: "center",
        margin: 5,
    },
    pressedOpacity: {
        opacity: 0.5
    },
    textInput: {
        borderColor: Colors.accent,
        borderWidth: 1,
        minWidth: 50,
        borderRadius: 4,
        textAlign: "center",
        padding: 3,
        margin: 5,
        color: "white",
    },
});

export const imageStyles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        margin: 16,
        height: 150,
        borderRadius: 8,
    },
    innerContainer: {
        // borderWidth: 1,
        // borderColor: "#ccc",
        justifyContent: "space-between",
        alignItems: "center",
    },
    image: {
        borderRadius: 8,
        borderWidth: 3,
        borderColor: Colors.accent,
        width: "100%",
        height: "100%",
        margin: 10,
    },
    profilePicture: {
        width: 150,
        height: 150,
    }
});