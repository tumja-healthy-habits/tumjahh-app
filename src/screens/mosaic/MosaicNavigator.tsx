import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AppParamList } from "components/LoggedInApp"
import PickMosaicsModal from "components/mosaic/PickMosaicsModal"
import MosaicListScreen from "./MosaicListScreen"
import CreateMosaicScreen from "./CreateMosaicScreen"
import EditMosaicScreen from "./EditMosaicScreen"
import NewMosaicScreen from "./MosaicScreen"

export type MosaicParamList = {
    "List": undefined,
    "SingleMosaic": {
        mosaicId: string,
    },
    "CreateMosaic": undefined,
    "EditMosaic":{
        mosaicId:string,
    }
}

const navigatorOptions = {
    headerShown: false,
}

const MosaicStack = createStackNavigator<MosaicParamList>()

export default function MosaicNavigator() {
    const { params } = useRoute<RouteProp<AppParamList, "Mosaic">>()
    const { setParams } = useNavigation<NavigationProp<AppParamList, "Mosaic">>()

    return (<>
        <MosaicStack.Navigator screenOptions={navigatorOptions} initialRouteName="List">
            <MosaicStack.Screen name="List" component={MosaicListScreen} />
            <MosaicStack.Screen name="SingleMosaic" component={NewMosaicScreen} />
            <MosaicStack.Screen name="CreateMosaic" component={CreateMosaicScreen} />
            <MosaicStack.Screen name="EditMosaic" component={EditMosaicScreen} />
        </MosaicStack.Navigator>
        <PickMosaicsModal
            visible={params !== undefined && params.photoId !== undefined}
            photoId={params && params.photoId}
            onClose={() => setParams({ photoId: undefined })}
        />
    </>)
}