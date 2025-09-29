Pet Colony - Arquitetura de Servidor Distribuído com IA
📋 Visão Geral
Este projeto implementa um servidor Node.js que permite comunicação entre múltiplos dispositivos móveis (React Native/Expo) sem depender de um servidor fixo tradicional, utilizando uma abordagem de rede distribuída ("colônia") com IA integrada para classificação de características de animais.

🏗️ Arquitetura do Sistema
Componentes Principais
Servidor Node.js Leve

Comunicação P2P (WebSocket + HTTP)

IA Local Integrada (TensorFlow.js)

Cliente React Native/Expo

📁 Estrutura do Projeto
text
backend/
├── server.js              # Servidor principal
├── package.json
├── models/
│   └── animal-model/      # Modelo de IA
│       ├── model.json
│       └── weights.bin
├── utils/
│   ├── socketManager.js   # Gerenciamento de conexões
│   └── aiProcessor.js     # Processamento de IA
└── config/
    └── constants.js       # Configurações
🔧 Planos de Implementação
Plano 1: Servidor Centralizado Simples (Inicial)
Tecnologias:

Node.js + Express

Socket.IO

TensorFlow.js

Implementação:

javascript
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const tf = require('@tensorflow/tfjs-node');

class ColonyServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server);
    this.connectedDevices = new Map();
    this.aiModel = null;
  }
  
  async initialize() {
    await this.loadAIModel();
    this.setupRoutes();
    this.setupSocketHandlers();
  }
  
  async loadAIModel() {
    this.aiModel = await tf.loadLayersModel('file://models/animal-model/model.json');
  }
  
  setupRoutes() {
    this.app.use(express.json());
    
    // Endpoint de saúde
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'online', 
        devices: this.connectedDevices.size,
        model: this.aiModel ? 'loaded' : 'not loaded'
      });
    });
    
    // Endpoint de predição
    this.app.post('/predict', async (req, res) => {
      try {
        const input = req.body.input;
        const prediction = await this.processPrediction(input);
        res.json({ prediction });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
  
  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Dispositivo conectado:', socket.id);
      
      // Registrar dispositivo
      this.connectedDevices.set(socket.id, {
        id: socket.id,
        connectedAt: new Date(),
        lastActivity: new Date()
      });
      
      // Broadcast para outros dispositivos
      socket.broadcast.emit('device_connected', { id: socket.id });
      
      // Mensagens entre dispositivos
      socket.on('message', (data) => {
        this.handleDeviceMessage(socket, data);
      });
      
      // Predição distribuída
      socket.on('predict_request', (data) => {
        this.handleDistributedPrediction(socket, data);
      });
      
      socket.on('disconnect', () => {
        this.connectedDevices.delete(socket.id);
        socket.broadcast.emit('device_disconnected', { id: socket.id });
      });
    });
  }
  
  async processPrediction(input) {
    const tensor = tf.tensor([input]);
    const prediction = this.aiModel.predict(tensor);
    const result = await prediction.data();
    tensor.dispose();
    prediction.dispose();
    return result;
  }
  
  handleDeviceMessage(sender, data) {
    // Encaminhar mensagem para dispositivos específicos ou broadcast
    if (data.targetDevice) {
      sender.to(data.targetDevice).emit('message', {
        from: sender.id,
        message: data.message,
        timestamp: new Date()
      });
    } else {
      sender.broadcast.emit('message', {
        from: sender.id,
        message: data.message,
        timestamp: new Date()
      });
    }
  }
  
  handleDistributedPrediction(sender, data) {
    // Implementar lógica de predição distribuída entre dispositivos
    this.processPrediction(data.input).then(result => {
      sender.emit('prediction_result', { result, requestId: data.requestId });
    });
  }
  
  start(port = 3000) {
    this.server.listen(port, () => {
      console.log(`Servidor Colônia rodando na porta ${port}`);
      console.log(`Dispositivos conectados: ${this.connectedDevices.size}`);
    });
  }
}

module.exports = ColonyServer;
Plano 2: Rede Híbrida P2P
Tecnologias:

Node.js + Express

WebRTC (via Socket.IO)

TensorFlow.js

Características:

Servidor inicial para handshake

Conexões diretas entre dispositivos

Comunicação descentralizada após conexão inicial

Plano 3: Servidor Móvel com Hotspot
Implementação:

Um dispositivo móvel funciona como servidor temporário

Outros dispositivos conectam via WiFi Direct/Hotspot

IA roda localmente em cada dispositivo

🚀 Como Executar
Pré-requisitos
Node.js 16+

npm ou yarn

Instalação
bash
# Clone o repositório
cd backend

# Instale as dependências
npm install express socket.io @tensorflow/tfjs-node cors

# Execute o servidor
node server.js
Configuração do Cliente React Native
javascript
// No app React Native
import io from 'socket.io-client';
import * as tf from '@tensorflow/tfjs';

class ColonyClient {
  constructor(serverUrl) {
    this.socket = io(serverUrl);
    this.setupSocketListeners();
  }
  
  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Conectado ao servidor colônia');
    });
    
    this.socket.on('message', (data) => {
      this.handleIncomingMessage(data);
    });
    
    this.socket.on('device_connected', (data) => {
      console.log('Novo dispositivo conectado:', data.id);
    });
  }
  
  sendMessageToDevice(deviceId, message) {
    this.socket.emit('message', {
      targetDevice: deviceId,
      message: message
    });
  }
  
  broadcastMessage(message) {
    this.socket.emit('message', {
      message: message
    });
  }
  
  async requestPrediction(inputData) {
    const response = await fetch(`${this.serverUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: inputData })
    });
    return await response.json();
  }
}
🔄 Fluxo de Comunicação
Conexão Inicial: Dispositivos conectam ao servidor

Descoberta: Servidor notifica sobre outros dispositivos conectados

Comunicação: Mensagens diretas entre dispositivos

Processamento IA: Predições locais ou distribuídas

Sincronização: Troca de resultados e aprendizado colaborativo

🎯 Funcionalidades da IA
Modelo de Classificação de Animais
Entrada: Características (porte, cor, idade, comportamento)

Saída: Classificação (espécie, raça, compatibilidade)

Processamento: Local no servidor ou distribuído

Exemplo de Dados
javascript
const animalFeatures = {
  size: 'medium',     // small, medium, large
  color: 'brown',
  age: 2,            // anos
  temperament: 'calm', // calm, active, playful
  species: 'dog'      // dog, cat, bird, etc.
};
🌐 Estratégias de Deploy Sem Servidor Fixo
Opção 1: Serviços Cloud Gratuitos
Railway.app (free tier)

Heroku (free tier limitado)

Render.com (free tier)

Opção 2: Servidor em Dispositivo Móvel
Usar nodejs-mobile no React Native

Um dispositivo age como servidor temporário

Opção 3: P2P Puro
Usar WebRTC para conexões diretas

Servidor apenas para signaling inicial

📈 Melhorias Futuras
Federated Learning: Modelo de IA que aprende com todos os dispositivos

Offline-First: Funcionamento sem internet

Cache Inteligente: Dados e modelos em cache local

Segurança: Criptografia de ponta-a-ponta

Balanceamento: Distribuição de carga entre dispositivos

🐛 Solução de Problemas
Problemas Comuns:
Portas bloqueadas: Usar porta 3000, 8080, ou 5000

Firewall: Configurar exceções no firewall

NAT: Usar serviços como ngrok para desenvolvimento

Memória: Otimizar modelo de IA para baixo consumo

Comando Ngrok para Testes:
bash
ngrok http 3000
Esta arquitetura proporciona uma solução flexível e descentralizada para comunicação entre dispositivos móveis com capacidades de IA integradas, ideal para aplicações que não dependem de infraestrutura fixa.