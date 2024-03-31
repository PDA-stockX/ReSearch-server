FROM node:21.7.1

RUN mkdir -p /research-server
WORKDIR /research-server
ADD . /research-server
RUN npm install

EXPOSE 3000

CMD ["npx", "sequelize-cli", "db:migrate", "--env", "production"]
CMD ["npm", "start:prod"]