import PocketBase from 'pocketbase'

const PB_URL: string = "https://7d39-2001-9e8-3330-e900-9c77-5795-f65a-1ac1.ngrok-free.app/"
const pb: PocketBase = new PocketBase(PB_URL)

pb.autoCancellation(false)

export { pb }