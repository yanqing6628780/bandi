# AuthBox
        
## Start Service

### Development

```  
npm install
cd src
npm install  
gulp -d  
```

### Deploy

```
npm install
gulp
cd dist
npm install
npm start
```

## Get Start

### 安装MongoDb

一、首先安装mongodb
1.mongodb[下载链接](https://www.mongodb.com/cn) （也可以到内网Share盘到找`mongodb-win32-x86_64-2008plus-ssl-3.2.10-signed.msi`文件）
2.解压缩到自己想要安装的目录，比如`d:\mongodb`
3.创建文件夹d:\mongodb\data\db、d:\mongodb\data\log，分别用来安装db和日志文件，在log文件夹下创建一个日志文件MongoDB.log，即d:\mongodb\data\log\MongoDB.log
4.运行cmd.exe进入dos命令界面，执行下列命令
```
> cd d:\mongodb\bin
> d:\mongodb\bin> mongod -dbpath "d:\mongodb\data\db"
```

![image](http://images.cnitblog.com/blog/203292/201308/21110329-868b0d1fb023479f9a605fc8353515f2.png)

5.测试连接

新开一个cmd窗口，进入mongodb的bin目录，输入mongo或者mongo.exe，出现如下信息说明测试通过，此时我们已经进入了test这个数据库，如何进入其他数据库下面会说。

![image](http://images.cnitblog.com/blog/203292/201308/21111025-91a3b6a9bde844688300928f0a9ea26f.png)

[6.]如果无法连接数据库
当mongod.exe被关闭时，mongo.exe 就无法连接到数据库了，因此每次想使用mongodb数据库都要开启mongod.exe程序，所以比较麻烦，此时我们可以将MongoDB安装为windows服务
还是运行cmd，进入bin文件夹，执行下列命令
```  
> d:\mongodb\bin>mongod --dbpath "d:\mongodb\data\db" --logpath "d:\mongodb\data\log\MongoDB.log" --install --serviceName "MongoDB"
```

这里MongoDB.log就是开始建立的日志文件，--serviceName "MongoDB" 服务名为MongoDB
接着启动mongodb服务
```  
> d:\mongodb\bin>NET START MongoDB
```

打开任务管理器，可以看到进程已经启动

7.关闭服务和删除进程
```
> d:\mongodb\bin>NET stop MongoDB   (关闭服务)

> d:\mongodb\bin>mongod --dbpath "d:\mongodb\data\db" --logpath "d:\mongodb\data\log\MongoDB.log" --remove --serviceName "MongoDB"      (删除，注意不是--install了）
```

### 数据库数据填充

请执行下面命令 

```  
gulp db
```


## 目录结构

* src/ 服务器文件
    * bin/www 服务器启动文件
    * app.js express配置
    * /app
    * /app/controllers 控制器
    * /app/middlewares 中间件
    * /app/utils 自己封装的库
    * /app/views 模板
    * /config 配置文件夹
    * /resources 资源文件夹
        * /assets 生成前的静态文件资源js/css/images
            * /images
            * /javascript
            * /stylesheet
        * /seeder 数据库数据填充
        * /theme  前端jade模板.
            * kerwin 第一个模板版本
    * /logs 日志文件夹
    * /public 生成后静态文件资源。页面从这里访问js/css/images/html各类静态资源
        * /images
        * /javascripts
        * /stylesheets
        * /apidoc 接口文档.html
