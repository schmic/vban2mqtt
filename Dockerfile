FROM node:lts-hydrogen as build

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build 

FROM node:lts-hydrogen

WORKDIR /opt/vban2mqtt

COPY --from=build /usr/src/app/package.json /opt/vban2mqtt/
COPY --from=build /usr/src/app/build/ /opt/vban2mqtt/

RUN npm install --omit dev

RUN ls -l

ENTRYPOINT [ "node", "index.js" ]