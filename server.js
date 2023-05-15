const net = require('net');

const data = {}; 
const sockets = [];

const server = net.createServer((socket) => {
  console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
  sockets.push(socket.remotePort);
  console.log(`Clientes conectados: ${sockets.length}`);

  
  socket.setEncoding('utf8');

  
  data[socket.remotePort] = {
    pokemon: '',
    vida: 0,
    last: ''
  };

  
  socket.on('data', (msg) => {
    if(msg === 'Conect'){
      console.log(`Mensagem recebida de ${socket.remoteAddress}:${socket.remotePort}: ${msg}`);
      socket.write(`Conectado`);
    }else if(msg === 'user2'){
      console.log(`Mensagem recebida de ${socket.remoteAddress}:${socket.remotePort}: ${msg}`);
      const filteredSockets = [];

      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i] !== socket.remotePort) {
          filteredSockets.push(sockets[i]);
        }
      }
    
      if (filteredSockets.length > 0 && data != null) {
        console.log(data[filteredSockets[0]].pokemon);
        socket.write(data[filteredSockets[0]].pokemon);
      } else {
        console.log('somente 1 jogador');
        socket.write('unde');
      }
    }else if(msg === 'life'){
      console.log(`Mensagem recebida de ${socket.remoteAddress}:${socket.remotePort}: ${msg}`);
      const filteredSockets = [];

      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i] !== socket.remotePort) {
          filteredSockets.push(sockets[i]);
        }
      }
    
      if (filteredSockets.length > 0 && data != null) {
        console.log("you:"+data[socket.remotePort].vida+",user2:"+data[filteredSockets[0]].vida);
        socket.write("you:"+data[socket.remotePort].vida+",user2:"+data[filteredSockets[0]].vida);
      } else {
        console.log('somente 1 jogador');
        socket.write('unde');
      }
    }else if(msg.includes('attack')) {
      console.log(`Mensagem recebida de ${socket.remoteAddress}:${socket.remotePort}: ${msg}`);
      const attackValue = parseInt(msg.split(':')[1]); 
      console.log(`Valor do ataque: ${attackValue}`);
      const filteredSockets = [];
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i] !== socket.remotePort) {
          filteredSockets.push(sockets[i]);
        }
      }
     const life= data[filteredSockets[0]].vida
     data[filteredSockets[0]].vida = life - attackValue
     
    }
    else if(msg) {
      console.log(`{pokemon}Mensagem recebida de ${socket.remoteAddress}:${socket.remotePort}: ${msg}`);

    
    const [pokemon, vida,attack, last] = msg.trim().split(',');

    
    data[socket.remotePort].pokemon = pokemon;
    data[socket.remotePort].vida = parseInt(vida);
    data[socket.remotePort].attack = parseInt(attack);
    data[socket.remotePort].last = last;

    
    
    }
  });

  
  socket.on('end', () => {
    const index = sockets.indexOf(socket.remotePort);
    if (index !== -1) {
      sockets.splice(index, 1);
    }
    console.log(`Cliente desconectado: ${socket.remoteAddress}:${socket.remotePort}`);
  });
});


server.listen(8080,'192.168.3.3', () => {
  console.log('Servidor TCP iniciado na porta 8080.');
});
