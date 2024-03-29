FROM node:8
#设置工作目录
WORKDIR /www
COPY ./package.json /www
COPY ./.npmrc /www

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g pm2
RUN cnpm install

#复制所有文件到 工作目录。
COPY . /www

RUN npm run gulp
#暴露container的端口
EXPOSE 8080

#运行命令
ENV NODE_ENV=production
CMD ["npm", "start"]
