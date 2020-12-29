const Corestore = require('.')
const ram = require('random-access-memory')

async function main () {
  const alice = new Corestore(ram)
  const bob = new Corestore(ram)
  await alice.ready()
  await bob.ready()

  // public channel
  const alicesLiveStream = bob.readable({
    key: alice.key,
    channel: 'livestream'
  })
  const myLiveStream = alice.writable({
    channel: 'livestream'
  })
  console.log(myLiveStream.key.equals(alicesLiveStream.key))

  // private channel
  const fromAlice = bob.readable({
    key: alice.key,
    channel: 'letters',
    private: true
  })
  const toBob = alice.writable({
    key: bob.key,
    channel: 'letters'
  })
  console.log(toBob.key.equals(fromAlice.key))
}

main()
