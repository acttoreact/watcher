FROM node:12-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . ./src
RUN cd ./src;npm install --silent;npm run build
RUN cp -r ./src/dist ./dist
RUN rm -rf ./src
ENV NODE_ENV production
VOLUME ["/usr/src/app/server"]
CMD npm start