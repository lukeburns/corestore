import Channelstore from './index.js'
import crypto from 'hypercore-crypto'

const { publicKey: aliceKey, secretKey: alicePrimaryKey } = crypto.keyPair()
const { publicKey: bobKey, secretKey: bobPrimaryKey } = crypto.keyPair()

const alice = new Channelstore('./alice.db', { primaryKey: alicePrimaryKey })
const aliceSharedSecret = await alice.deriveSharedSecret(bobKey)
const aliceToBob = await alice.createKeyPair(aliceSharedSecret)
const core = alice.get({ keyPair: aliceToBob })
await core.ready()
core.append('hi bob!')

const bob = new Channelstore('./bob.db', { primaryKey: bobPrimaryKey })
const bobSharedSecret = await bob.deriveSharedSecret(aliceKey)
const bobFromAlice = Channelstore.derivePublicKey(aliceKey, bobSharedSecret)
const clone = bob.get({ publicKey: bobFromAlice })
await clone.ready()

const a = alice.replicate(true)
const b = bob.replicate(false)
a.pipe(b).pipe(a)

clone.on('append', async () => {
    console.log((await clone.get(0)).toString())
})