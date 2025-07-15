// mc-agent/Dockerfile FROM node:20-alpine

Create app directory

WORKDIR /usr/src/app

Install dependencies

COPY package*.json ./ RUN npm install --production

Copy source code

COPY . .

Expose port (optional)

EXPOSE 3001

Start the agent

CMD ["node", "index.js"]

