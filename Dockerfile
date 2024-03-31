FROM node:21.7.1

RUN mkdir -p /research-server
WORKDIR /research-server
ADD . /research-server
RUN npm install

ENV NODE_ENV development

EXPOSE 3000

CMD ["npm", "start"]