import { RouteProp, useRoute } from "@react-navigation/native";
import NewMosaicGridCopy from "components/mosaic/NewMosaicGridCopy";
import { SafeAreaView } from "react-native";
import { MosaicParamList } from "./MosaicNavigator";

export default function NewMosaicScreen() {
    const { params } = useRoute<RouteProp<MosaicParamList, "SingleMosaic">>()

    return <SafeAreaView>
        <NewMosaicGridCopy mosaicId={params.mosaicId} />
    </SafeAreaView>
}