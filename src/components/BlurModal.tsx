import { BlurView } from "expo-blur"
import { Modal, Pressable } from "react-native"

type BlurModalProps = {
    visible: boolean,
    onClose?: () => void,
    children?: React.ReactNode,
    blurIntensity?: number,
}

const DEFAULT_INTENSITY: number = 50

export default function BlurModal({ visible, onClose, children, blurIntensity }: BlurModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable onPress={onClose} style={{ flex: 1 }}>
                <BlurView intensity={blurIntensity || DEFAULT_INTENSITY} style={{ flex: 1, justifyContent: "center" }}>
                    {children}
                </BlurView>
            </Pressable>
        </Modal>
    )
}