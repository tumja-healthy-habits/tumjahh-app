import { createContext, useContext, useEffect, useState } from "react"
import { pb, useRealTimeSubscription } from "src/pocketbaseService"
import { MosaicMembersRecord, MosaicRecord } from "types"
import { useAuthenticatedUser } from "./AuthenticatedUserProvider"

type MosaicsContext = {
    mosaics: MosaicRecord[],
}

const MosaicsContext = createContext<MosaicsContext>({
    mosaics: [],
})

export default function MosaicsProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuthenticatedUser()
    const [mosaics, setMosaics] = useState<MosaicRecord[]>([])

    useEffect(() => {
        pb.collection("mosaics").getFullList<MosaicRecord>()
            .then(setMosaics)
            .catch(error => console.error("Failed to get mosaics", error))
    }, [currentUser])

    useRealTimeSubscription<MosaicRecord>("mosaics", {
        onCreate: (mosaic: MosaicRecord) => setMosaics((mosaics: MosaicRecord[]) => [...mosaics, mosaic]),
        onDelete: (mosaic: MosaicRecord) => setMosaics((mosaics: MosaicRecord[]) => mosaics.filter((m: MosaicRecord) => m.id !== mosaic.id)),
        onUpdate: (mosaic: MosaicRecord) => setMosaics((mosaics: MosaicRecord[]) => mosaics.map((m: MosaicRecord) => m.id === mosaic.id ? mosaic : m)),
    })

    useRealTimeSubscription<MosaicMembersRecord>("mosaic_members", {
        onCreate: (member: MosaicMembersRecord) => {
            if (currentUser !== null && member.user_id === currentUser.id) {
                pb.collection("mosaics").getOne<MosaicRecord>(member.mosaic_id).then((newMosaic: MosaicRecord) =>
                    setMosaics((oldMosaics: MosaicRecord[]) => [...oldMosaics, newMosaic])
                )
            }
        },
        onDelete: (member: MosaicMembersRecord) => {
            if (currentUser !== null && member.user_id === currentUser.id) {
                setMosaics((oldMosaics: MosaicRecord[]) => mosaics.filter((mosaic: MosaicRecord) => mosaic.id !== member.mosaic_id))
            }
        },
    })

    return <MosaicsContext.Provider value={{ mosaics }}>
        {children}
    </MosaicsContext.Provider>
}

export function useMosaics() {
    return useContext(MosaicsContext).mosaics
}