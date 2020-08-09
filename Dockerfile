FROM node:12

USER root

WORKDIR /usr/stonks-go-brrr-api/

COPY --chown=node:node package.json ./

RUN npm install

ADD . /usr/stonks-go-brrr-api/

RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]


