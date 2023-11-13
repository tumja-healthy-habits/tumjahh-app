import { createStackNavigator } from "@react-navigation/stack"
import MosaicListScreen from "./MosaicListScreen"
import NewMosaicScreen from "./NewMosaicScreen"

export type MosaicParamList = {
    "List": undefined,
    "Mosaic": {
        mosaicId: string,
    },
}

const navigatorOptions = {
    headerShown: false,
}

const MosaicStack = createStackNavigator<MosaicParamList>()

export default function MosaicNavigator() {
    return (
        <MosaicStack.Navigator screenOptions={navigatorOptions}>
            <MosaicStack.Screen name="List" component={MosaicListScreen} />
            <MosaicStack.Screen name="Mosaic" component={NewMosaicScreen} />
        </MosaicStack.Navigator>
    )
}