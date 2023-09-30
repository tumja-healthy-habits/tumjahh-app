import PocketBase from 'pocketbase'

const PB_URL: string = "http://tuzvhja-habits.srv.mwn.de/"
const pb: PocketBase = new PocketBase(PB_URL)

pb.autoCancellation(false)

export { pb }
