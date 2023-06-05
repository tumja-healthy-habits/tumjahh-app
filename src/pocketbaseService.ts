import PocketBase from 'pocketbase'

const PB_URL: string = "https://355a-2001-4ca0-0-f232-1c13-ce1f-851e-d8a.ngrok-free.app/"
const pb: PocketBase = new PocketBase(PB_URL)

pb.autoCancellation(false)

export { pb }