import { RouteProp, useRoute } from "@react-navigation/native";
import NewMosaicGrid from "components/NewMosaicGrid";
import { SafeAreaView } from "react-native";
import { MosaicParamList } from "./MosaicNavigator";

export default function NewMosaicScreen() {
    const { params } = useRoute<RouteProp<MosaicParamList, "Mosaic">>()

    return <SafeAreaView>
        <NewMosaicGrid mosaicId={params.mosaicId} />
    </SafeAreaView>
}