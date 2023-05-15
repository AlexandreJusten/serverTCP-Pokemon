const TCP = require('dgram')

const client = TCP.createSocket('udp4')

const port = 9991

const hostname = 'localhost'


function sleep() {
  return new Promise(resolve => setTimeout(resolve, 3000))
}

client.on('message', (message, info) => {
  console.log('Message from server', message.toString())
  main()
})

const packet = "cliente falou para vc ir comer"

main()
 
async function main() {
  await sleep()
  client.send(packet, port, hostname, (err) => {
    if (err) {
      console.error('Failed to send packet !!')
    } else {
      console.log('Packet send !!')
    }
  })
}