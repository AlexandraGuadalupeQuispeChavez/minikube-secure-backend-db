// app.js - API ligera con Express y Mongoose
const express = require('express');
const mongoose = require('mongoose');
const os = require('os');

// Variables de entorno (solo las definidas explícitamente)
const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASS,
  APP_PORT,
} = process.env;

// Construir la URI de conexión a MongoDB
const mongoUri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}?authSource=admin`;

// Estado de la conexión (por defecto "Error")
let dbConnected = false;

// Intentar conectar a MongoDB
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Conexión a MongoDB establecida');
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

const port = APP_PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en puerto ${port}`);
});
