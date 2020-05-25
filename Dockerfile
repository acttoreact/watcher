FROM node:12-alpine
WORKDIR /usr/src/app
LABEL Description="A2R Watcher"
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . ./src
RUN rm -rf ./src/server
VOLUME ["/usr/src/app/src/server"]
ENV NODE_ENV production
CMD cd ./src;npm install --silent;npm run build;cp -r ./bin ../bin;cd ..;rm -rf ./src;npm start