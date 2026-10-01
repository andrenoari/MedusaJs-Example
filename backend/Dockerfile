FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
RUN npm install

COPY . .
RUN npm run build --workspace=@dtc/backend

RUN cp -r apps/backend/.medusa/server/public apps/backend/public

ENV NODE_ENV=production
EXPOSE 9000

CMD ["npm", "run", "start", "--workspace=@dtc/backend"]
