import { NavigationProp, useNavigation } from "@react-navigation/native";
import MosaicPreview from "components/mosaic/MosaicPreview";
import Colors from "constants/colors";
import { FlatList, ListRenderItemInfo, SafeAreaView, StyleSheet } from "react-native";
import { MosaicParamList } from "screens/mosaic/MosaicNavigator";
import { useMosaics } from "src/store/MosaicsProvider";
import { MosaicRecord } from "types";
import IconButton from "../../components/misc/IconButton";

export default function () {
    const mosaics: MosaicRecord[] = useMosaics()

    const { navigate } = useNavigation<NavigationProp<MosaicParamList, "List">>()

    return <SafeAreaView style={styles.container}>
        <IconButton icon={"add"} color="black" onPress={() => navigate("CreateMosaic")} size={40} style={styles.button} />
        <FlatList
            data={mosaics}
            renderItem={(info: ListRenderItemInfo<MosaicRecord>) => <MosaicPreview record={info.item} />}
            keyExtractor={(mosaic: MosaicRecord) => mosaic.id}
            style={{ backgroundColor: Colors.backgroundProfile }}
        />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundProfile,
    },
    button: {
        alignSelf: "flex-end",
        paddingRight: 15
    }
})