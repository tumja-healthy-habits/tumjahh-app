import React from "react";
import Counter from "react-native-counters";
import { Colors } from "react-native/Libraries/NewAppScreen";

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