FROM node:21-alpine

# directorio de trabajo
WORKDIR /app

# copiar 'package.json' y 'package-lock.json'
COPY package*.json ./

# copiar los directorios y ficheros a la carpeta de trabajo
COPY . .

EXPOSE 5173