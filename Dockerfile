FROM node:8

#设置工作目录
COPY ./package.json /usr/src/app
COPY ./.npmrc /usr/src/app

RUN npm install pm2 gulp gulp-cli -g --registry=https://registry.npm.taobao.org && npm install --production --registry=https://registry.npm.taobao.org

#复制所有文件到 工作目录。
COPY . /usr/src/app

RUN gulp
#暴露container的端口
EXPOSE 8080

#运行命令
CMD ["pm2", "start", 'pm2.json']
