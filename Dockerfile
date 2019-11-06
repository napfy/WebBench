FROM node:carbon-alpine 
WORKDIR /app
RUN apk update
RUN apk add apache2-utils
COPY package.json . 
RUN cd /app
RUN npm install
COPY components ./components
COPY jsconfig.json .
COPY nuxt.config.js . 
COPY layouts ./layouts
COPY pages ./pages
COPY server ./server
COPY plugins ./plugins 
RUN npm run build
ENV PORT 3000
ENV HOST localhost
EXPOSE $PORT
CMD ["HOST=$HOST", "PORT=$PORT",  "npm", "run", "start" ]
