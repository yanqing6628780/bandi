FROM node:8

#创建app目录,保存我们的代码
RUN mkdir -p /www
#设置工作目录
WORKDIR /www
COPY ./package.json /www
COPY ./.npmrc /www

RUN npm install pm2 -g
RUN npm install gulp -g
RUN npm install --production --registry=https://registry.npm.taobao.org

#复制所有文件到 工作目录。
COPY . /www

RUN gulp
#暴露container的端口
EXPOSE 8080

#运行命令
CMD ["pm2", "start", 'pm2.json']
