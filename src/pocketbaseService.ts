import PocketBase from 'pocketbase'

const PB_URL: string = "https://cfc2-2003-ce-7f0f-8106-b5a1-149c-9dde-8048.eu.ngrok.io/"
export const pb: PocketBase = new PocketBase(PB_URL)
