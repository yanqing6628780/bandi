FROM node

#创建app目录,保存我们的代码
RUN mkdir -p /usr/src/node
#设置工作目录
WORKDIR /usr/src/node

#复制所有文件到 工作目录。
COPY /bandai /usr/src/node

#编译运行node项目，使用npm安装程序的所有依赖,利用taobao的npm安装

WORKDIR /usr/src/node/bandai
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run gulp
#暴露container的端口
EXPOSE 8080

#运行命令
CMD ["npm", "start"]
