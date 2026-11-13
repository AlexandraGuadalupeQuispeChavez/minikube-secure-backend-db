// app.js - API ligera con Express y Mongoose
const express = require('express');
const mongoose = require('mongoose');
const os = require('os');

// Obtener variables de entorno limpiando posibles espacios invisibles
const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST.trim() : 'localhost';
const DB_NAME = process.env.DB_NAME ? process.env.DB_NAME.trim() : 'test';
const DB_USER = process.env.DB_USER ? process.env.DB_USER.trim() : '';
const DB_PASS = process.env.DB_PASS ? process.env.DB_PASS.trim() : '';
const APP_PORT = process.env.APP_PORT ? process.env.APP_PORT.trim() : '3000';

// Construir la URI de conexión a MongoDB
const mongoUri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}?authSource=admin`;

let dbConnected = false;

// Conectar a MongoDB sin opciones obsoletas
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ Conexión a MongoDB establecida correctamente');
    dbConnected = true;
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    dbConnected = false;
  });

const app = express();

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Conexión exitosa a Kubernetes y MongoDB',
    estadoBD: dbConnected ? 'Conectado' : 'Error',
    DB_NAME,
    DB_HOST,
    APP_PORT,
    DB_USER,
    hostname: os.hostname(),
  });
});

const port = Number(APP_PORT) || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en puerto ${port}`);
});