FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install
EXPOSE 2022

CMD ["npm", "start"]
