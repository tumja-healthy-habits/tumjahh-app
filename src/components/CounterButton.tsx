import { useState } from "react"
import { View, TouchableOpacity, Button, Text } from "react-native"
import { styles } from "../styles"

type CounterButtonProps = {
    color: string
}

export default function CounterButton({ color }: CounterButtonProps) {
    const [count, setCount] = useState<number>(0)

    function incrementCounter() {
        setCount(prev => prev + 1)
    }

    return (
        <View style={styles.container}>
            <Text>{count}</Text>
            <TouchableOpacity onPress={incrementCounter}>
                <Text>Increase</Text>
            </TouchableOpacity>
            <Button
                title="Increment counter"
                onPress={incrementCounter}
                color={color} />
        </View>
    )
}