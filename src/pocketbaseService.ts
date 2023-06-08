import PocketBase from 'pocketbase'

const PB_URL: string = "https://29b2-138-246-3-113.ngrok-free.app/"
const pb: PocketBase = new PocketBase(PB_URL)

pb.autoCancellation(false)

export { pb }