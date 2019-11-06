FROM node:carbon-alpine 
WORKDIR /app
RUN apk update
RUN apk add apache2-utils
COPY package.json . 
RUN cd /app && npm install
COPY components ./components
COPY jsconfig.json .
COPY nuxt.config.js . 
COPY layouts ./layouts
COPY pages ./pages
COPY server ./server
COPY plugins ./plugins 
RUN npm run build
EXPOSE 3010
CMD [ "npm", "run", "start" ]
