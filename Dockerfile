FROM node:12-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
VOLUME ["/usr/src/app/server"]
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY ./dist ./dist
CMD npm start