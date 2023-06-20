import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useEffect, useState } from "react"
import { MosaiqueData } from "types"

export const VAR_NUM_RINGS: string = "BeHealthyNumRings"
export const VAR_IMAGE_IDS: string = "BeHealthyMosaique"


type MosaiqueContext = {
    numRings: number,
    putImage: (i: number, j: number, uri: string) => void,
    getImageUri: (i: number, j: number) => string,
    deleteMosaique: () => void,
}

const MosaiqueContext = createContext<MosaiqueContext>({
    numRings: 0,
    putImage: () => { },
    getImageUri: () => "",
    deleteMosaique: () => { },
})

export default function MosaiqueDataProvider({ children }: any) {
    const [numRings, setNumRings] = useState<number>(0)
    const [imageUris, setImageUris] = useState<MosaiqueData>({})

    useEffect(() => {
        AsyncStorage.getItem(VAR_NUM_RINGS).then((numRings) => {
            if (numRings === null) {
                AsyncStorage.setItem(VAR_NUM_RINGS, JSON.stringify(0))
            } else {
                setNumRings(JSON.parse(numRings))
            }
        })
        AsyncStorage.getItem(VAR_IMAGE_IDS).then((imageIds) => {
            if (imageIds === null) {
                AsyncStorage.setItem(VAR_IMAGE_IDS, JSON.stringify({}))
            } else {
                setImageUris(JSON.parse(imageIds))
            }
        })
    }, [])

    useEffect(() => console.log("numRings has been updated"), [numRings])

    useEffect(() => {
        if (ringCompleted()) {
            AsyncStorage.setItem(VAR_NUM_RINGS, JSON.stringify(numRings + 1))
            setNumRings((oldNumRings: number) => oldNumRings + 1)
        }
    }, [imageUris])

    function ringCompleted(): boolean {
        const numTiles = Math.pow((2 * numRings + 1), 2)
        const numImages: number = Object.keys(imageUris).reduce((acc: number, outerKey: string) => {
            const innerObj = imageUris[parseInt(outerKey)];
            const innerKeys = Object.keys(innerObj);
            const innerLength = innerKeys.filter((innerKey) => innerObj[parseInt(innerKey)] !== undefined && innerObj[parseInt(innerKey)] !== "").length;
            return innerLength + acc;
        }, 0);
        return numImages === numTiles
    }

    return (
        <MosaiqueContext.Provider value={{
            numRings,
            putImage: (i: number, j: number, uri: string) => {
                AsyncStorage.mergeItem(VAR_IMAGE_IDS, JSON.stringify({
                    [i]: {
                        [j]: uri
                    }
                }))
                setImageUris((imageUris) => {
                    const newImageUris: MosaiqueData = { ...imageUris }
                    if (newImageUris[i] === undefined) newImageUris[i] = []
                    newImageUris[i][j] = uri
                    return newImageUris
                })
            },
            getImageUri: (i: number, j: number) => {
                return imageUris[i] && imageUris[i][j] || ""
            },
            deleteMosaique: () => {
                AsyncStorage.setItem(VAR_IMAGE_IDS, JSON.stringify({}))
                AsyncStorage.setItem(VAR_NUM_RINGS, JSON.stringify(0))
                setImageUris([])
                setNumRings(0)
            },
        }}>
            {children}
        </MosaiqueContext.Provider>
    )
}

export function useMosaiqueData() {
    return useContext(MosaiqueContext)
}