FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

COPY . .

CMD ["node", "src/index.js"]