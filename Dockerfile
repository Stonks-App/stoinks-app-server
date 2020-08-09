FROM node:12

RUN npm i -g nodemon

USER root

WORKDIR /usr/stonks-go-brrr-api/

COPY --chown=node:node package-lock.json package.json ./

RUN npm ci

COPY --chown=node:node . . 


EXPOSE 4000

CMD ["nodemon", "index.ts"]

