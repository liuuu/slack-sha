FROM node:8
WORKDIR /app
COPY package-lock.json .
COPY package.json .
COPY wait-for-it.sh .
RUN npm install
COPY dist .
CMD node index.js