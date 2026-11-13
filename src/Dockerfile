# Dockerfile para la API backend
# Imagen base ligera basada en Node.js Alpine
FROM node:18-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar los archivos de package y lock (si existiera) y luego instalar dependencias
COPY package.json ./
RUN npm install --only=production

# Copiar el resto del código fuente
COPY . ./

# Exponer el puerto que usará la aplicación (valor por defecto 3000)
EXPOSE 3000

# Definir el comando de inicio
CMD ["npm", "start"]
