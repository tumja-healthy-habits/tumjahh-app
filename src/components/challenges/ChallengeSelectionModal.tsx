import Colors from "constants/colors"
import React, { useEffect } from "react"
import { ActivityIndicator, FlatList, ListRenderItemInfo, Modal, SafeAreaView, Text, View } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { pb, useCollection } from "src/pocketbaseService"
import { useAuthenticatedUser } from "src/store/AuthenticatedUserProvider"
import { globalStyles } from "src/styles"
import { ChallengesRecord, HabitsRecord, UserRecord } from "types"
import ActionButton from "../misc/ActionButton"
import ContentBox from "../misc/ContentBox"

export const VAR_CHALLENGES: string = "BeHealthyChallenges"

type ChallengeSelectionModalProps = {
    visible?: boolean,
    onClose?: () => void,
}

export default function ChallengeSelectionModal({ visible, onClose }: ChallengeSelectionModalProps) {

    const { currentUser } = useAuthenticatedUser()
    const [selectedChallenges, setSelectedChallenges] = React.useState<ChallengesRecord[]>([])
    const challenges: ChallengesRecord[] = useCollection<ChallengesRecord>("challenges", [])

    useEffect(() => {
        console.log("use effect", currentUser)
        if (currentUser === null) return
        pb.collection("users").getOne<UserRecord>(currentUser.id, {
            expand: "selectedChallenges",
        }).then((user: UserRecord) => {
            console.log("got user", user)
            setSelectedChallenges(user.expand.selectedChallenges)
        }).catch(console.error)
    }, [currentUser])

    function renderChallenge({ item }: ListRenderItemInfo<ChallengesRecord>) {
        console.log("rendering challenge", item, selectedChallenges)
        return (
            <BouncyCheckbox
                size={25}
                text={item.name}
                isChecked={selectedChallenges && selectedChallenges.some((challenge: ChallengesRecord) => challenge.id === item.id)}
                onPress={(isChecked: boolean) => {
                    if (isChecked) {
                        setSelectedChallenges((oldChallenges: ChallengesRecord[]) => [...oldChallenges, item])
                    } else {
                        setSelectedChallenges((oldChallenges: ChallengesRecord[]) => oldChallenges.filter((challenge: ChallengesRecord) => challenge.id !== item.id))
                    }
                }}
                textStyle={{
                    textDecorationLine: "none",
                }}
                textContainerStyle={{
                    marginVertical: 10,
                    marginStart: 30,
                }}
                iconStyle={{
                    marginStart: 25,
                }}
                fillColor={Colors.pastelViolet}
                unfillColor={Colors.pastelViolet}
            />
        )
    }

    function renderHabit({ item }: ListRenderItemInfo<HabitsRecord>) {
        return (
            <ContentBox style={{ alignItems: "flex-start" }}>
                <Text style={[globalStyles.textfieldText, globalStyles.textfieldTitle, { marginVertical: 10, alignSelf: "center" }]}>{item.title}</Text>
                <FlatList
                    data={item.challenges}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={renderChallenge}
                />
            </ContentBox>
        )
    }

    function handleConfirm(): void {
        if (currentUser === null) return
        pb.collection("users").update<UserRecord>(currentUser.id, {
            selectedChallenges: selectedChallenges.map((challenge: ChallengesRecord) => challenge.id),
        }).then(() => {
            if (onClose) {
                onClose()
            }
        }).catch(console.error)
    }

    // rendered at the end of the list
    const ListFooter = () => <ActionButton title="Confirm selection" onPress={handleConfirm} />

    // rendered between the challenge cards
    const ItemSeparator = () => <View style={{ padding: 10 }} />

    // rendered when the data passed to the list is empty
    const ListEmpty = () => <ActivityIndicator color={Colors.accent} size="large" />

    // always rendered on top of the list
    const ListHeader = () => <View style={{ padding: 20, backgroundColor: Colors.pastelOrange }}>
        <Text style={globalStyles.textfieldTitle}>Pick your challenges</Text>
    </View>

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
                <FlatList
                    data={challenges}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChallenge}
                    ListFooterComponent={ListFooter}
                    ItemSeparatorComponent={ItemSeparator}
                    ListEmptyComponent={ListEmpty}
                    ListHeaderComponent={ListHeader}
                    stickyHeaderIndices={[0]}
                />
            </SafeAreaView>
        </Modal>
    )
}