import { RouteProp, useRoute } from "@react-navigation/native";
import NewMosaicGrid from "components/NewMosaicGrid";
import { MosaicParamList } from "./MosaicNavigator";

export default function NewMosaicScreen() {
    const { params } = useRoute<RouteProp<MosaicParamList, "Mosaic">>()

    return <NewMosaicGrid mosaicId={params.mosaicId} />
}