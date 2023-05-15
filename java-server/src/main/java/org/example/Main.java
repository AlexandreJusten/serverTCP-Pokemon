package org.example;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<Integer, PokemonData> data = new HashMap<>(); // objeto para armazenar os dados recebidos de cada conexão

        try {
            ServerSocket server = new ServerSocket(8080);
            System.out.println("Servidor TCP iniciado na porta 8080.");

            while (true) {
                Socket socket = server.accept();
                System.out.println("Cliente conectado: " + socket.getInetAddress().getHostAddress() + ":" + socket.getPort());

                // Cria um objeto vazio para essa conexão e armazena no objeto 'data'
                data.put(socket.getPort(), new PokemonData());

                // Cria uma nova thread para lidar com a conexão com o cliente
                new Thread(new ConnectionHandler(socket, data)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static class ConnectionHandler implements Runnable {
        private Socket socket;
        private HashMap<Integer, PokemonData> data;

        public ConnectionHandler(Socket socket, HashMap<Integer, PokemonData> data) {
            this.socket = socket;
            this.data = data;
        }

        @Override
        public void run() {

            try {
                // Define o encoding para receber mensagens como strings
                InputStream input = socket.getInputStream();
                OutputStream output = socket.getOutputStream();
                input.read(new byte[1024]); // Lê e descarta os bytes iniciais que são lixo

                // Escuta o evento 'data' para receber mensagens do cliente
                byte[] buffer = new byte[1024];
                int bytesRead = input.read(buffer);
                while (bytesRead != -1) {
                    String msg = new String(buffer, 0, bytesRead);
                    System.out.println("Mensagem recebida de " + socket.getInetAddress().getHostAddress() + ":" + socket.getPort() + ": " + msg);
                    if (msg.equals("Conect")){
                        output.write("Conectado".getBytes());
                        buffer = new byte[1024];
                        bytesRead = input.read(buffer);
                    }else {
                        // Faz o parsing da mensagem recebida para obter as informações do pokemon, vida e last
                        String[] parts = msg.trim().split(",");
                        String pokemon = parts[0];
                        int vida = Integer.parseInt(parts[1]);
                        int attack = Integer.parseInt(parts[2]);
                        String last = parts[3];

                        // Atualiza as informações do objeto correspondente à conexão
                        PokemonData pokemonData = data.get(socket.getPort());
                        pokemonData.setPokemon(pokemon);
                        pokemonData.setVida(vida);
                        pokemonData.setAttack(attack);
                        pokemonData.setLast(last);

                        // Envia uma mensagem de volta para o cliente
                        output.write("As informações do seu pokemon foram atualizadas!".getBytes());
                        System.out.println(pokemonData.getAttack());
                        // Lê a próxima mensagem
                        buffer = new byte[1024];
                        bytesRead = input.read(buffer);
                    }
                }

                // Escuta o evento 'end' para quando o cliente desconectar
                System.out.println("Cliente desconectado: " + socket.getInetAddress().getHostAddress() + ":" + socket.getPort());
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    static class PokemonData {
        private String pokemon;
        private int vida;
        private int attack;
        private String last;

        public String getPokemon() {
            return pokemon;
        }

        public void setPokemon(String pokemon) {
            this.pokemon = pokemon;
        }

        public int getVida() {
            return vida;
        }

        public void setVida(int vida) {
            this.vida = vida;
        }

        public int getAttack() {
            return attack;
        }

        public void setAttack(int attack) {
            this.attack = attack;
        }

        public String getLast() {
            return last;
        }

        public void setLast(String last) {
            this.last = last;
        }
    }
}