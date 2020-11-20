FROM node:latest

ENV MODE=http
ENV APP_PATH=/var/app
ENV NODE_PATH=$APP_PATH/node_modules
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

RUN mkdir -p $NODE_PATH
COPY package.json $APP_PATH
#WORKDIR $NODE_PATH
RUN npm install --prefix=$APP_PATH
RUN npm install -g nodemon --no-optional

# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8080
WORKDIR $APP_PATH/src
#ENTRYPOINT nodemon index.s
CMD nodemon NODE_PATH=$NODE_PATH /var/app/src/index.js --mode=$MODE
