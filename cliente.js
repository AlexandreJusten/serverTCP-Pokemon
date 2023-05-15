const net = require('net');

// Cria um novo socket para se conectar ao servidor
const client = new net.Socket();

// Conecta o socket ao servidor na porta 8080
client.connect(8080, '192.168.3.3', () => {
  console.log('Conectado ao servidor.');

  // Envia as informações do pokemon
  const pokemon = 'Charizard';
  const vida = 50;
  const attack = 10;
  const last = 'Thunderbolt';
  const message = `${pokemon},${vida},${attack},${last}`;

    client.write(message);

  
});

// Escuta o evento 'data' para receber respostas do servidor
client.on('data', (data) => {
  console.log(`Resposta do servidor: ${data}`);
});

// Escuta o evento 'close' para quando a conexão com o servidor é fechada
client.on('close', () => {
  console.log('Conexão com o servidor fechada.');
});
