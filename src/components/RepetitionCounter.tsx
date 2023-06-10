import React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Counter from "react-native-counters"
import { View } from "react-native";

type RepetitionCounterProps = {
    start: number,
    onChange?: (count: number) => void,
}

export default function RepetitionCounter({ start, onChange }: RepetitionCounterProps) {
    return <Counter
        start={start}
        onChange={onChange}
        buttonStyle={{
            borderColor: Colors.anotherPeachColor,
            backgroundColor: Colors.white,
        }}
        countTextStyle={{
            color: Colors.anotherPeachColor,
        }}
        buttonTextStyle={{
            color: Colors.anotherPeachColor,
        }}
    />
}