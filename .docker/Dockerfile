# Usa a imagem oficial do Node.js (versão 20 LTS, ou 22 se preferir)
FROM node:20

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se existir) da pasta backend
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da pasta backend
COPY . ./

# Compila a aplicação NestJS
RUN npm run build

# Define a porta que a aplicação vai expor
EXPOSE 3080

# Comando para rodar a aplicação em modo de produção
CMD ["npm", "run", "start:prod"]