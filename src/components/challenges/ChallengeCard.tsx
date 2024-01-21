import Colors from "constants/colors";
import { Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ChallengesRecord } from "types";

type ChallengeCardProps = {
    challenge: ChallengesRecord,
    isChecked: boolean,
    onPress: (isChecked: boolean) => void,
}

export default function ChallengeCard({ challenge, isChecked, onPress }: ChallengeCardProps) {
    const TextComponent = () => (
        <View style={{ flexDirection: "column", marginVertical: 10, marginStart: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{challenge.name}</Text>
            <Text style={{ fontSize: 15, }}>{challenge.description}</Text>
        </View>
    )
    return (
        <BouncyCheckbox
            size={40}
            iconImageStyle={{
                width: 25,
                height: 25,
            }}
            isChecked={isChecked}
            onPress={onPress}
            textComponent={<TextComponent />}
            iconStyle={{
                marginStart: 25,
            }}
            fillColor={Colors.pastelViolet}
            unfillColor={Colors.pastelViolet}
            style={{ paddingTop: 2 }}
        />
    )
}