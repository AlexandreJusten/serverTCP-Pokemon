const TCP = require('dgram')

const server = TCP.createSocket('udp4')

const port = 9991

response=0

function sleep() {
  return new Promise(resolve => setTimeout(resolve, 10000))
}

server.on('listening', () => {

  const address = server.address()

  console.log('Listining to ', 'Address: ', address.address, 'Port: ', address.port)
  sleep()
  main()
})


 function main() {

  
    server.on('message', (message, info) => {
      console.log('Message', message.toString())
    
      response++
    
      server.send(response+'', info.port, info.address, (err) => {
        if (err) {
          console.error('Failed to send response !!')
        } else {
          console.log('Response send Successfully')
        }
      })
    
    })
    
}

 
 


server.bind(port)