# buildHtmlSite.js 是什么？
是一个自定义生成静态html站点的命令行工具。可以在当前目录下，根据配置文件。对当前的ejs模版可以生成一批html页面。

# 功能
1. 支持：可配置拷贝的文件夹。
2. 支持：可配置注入模版的全局变量，并支持自定义接口请求返回的变量。
3. 支持：可配置根据接口生成纯静态翻页列表和纯详情页面。

# 安装
```
npm install buildhtmlsite -g
```
# 入门
1. 初始化项目
```sh
# 新建一个空目录
mkdir htmlSite
# 进入这个目录
cd htmlSite
# 初始化模版
build-html-site init=testß
```
2. 搭建模拟接口
> mockapi文件夹下是项目测试用的请求接口数据。需要在当前目录下启动一个http服务，并能通过以下地址访问：1.全局变量：http://localhost:8080/global.json 2.新闻列表：http://localhost:8080/newspage.json 3.新闻详情：http://localhost:8080/details.json 
> http服务推荐使用：[http-server](https://www.npmjs.com/package/http-server) 详细使用方法，自行百度。
> 注：如果启动的服务地址不是：http://localhost:8080/ 请修改config.js里的：let apiHost="http://localhost:8080/"
```sh
# 以http-server为例，如果没有安装，请用命令先安装：npm install --global http-server
# 保存当前命令行处在上一步的htmlSite内
http-server -c-1 -o
```
3. 生成
```sh
# 运行这条命令，会在当前目录中出现build文件，里面就是生成的静态文件了。
build-html-site
```

# 高级用法




# 如何运行和本地调试这个工具源代码。
```
# 配置npm全局使用淘宝镜像源
npm config set registry https://registry.npm.taobao.org
# 配置npm全局恢复官方镜像源
npm config set registry https://registry.npmjs.org

#npm项目根目录运行终端命令：(该npm包放进了本地npm缓存里)
npm link
#在其他项目里引用调试（与测试npm包关联）
npm link 包名
#取消与测试npm包关联
npm unlink 包名

```
# 资源参考
1. [npm包发布详细教程](https://blog.csdn.net/u010059669/article/details/109715342)
2. [生成全局命令,配置命令脚本npm link](https://blog.csdn.net/chunmeizhang_88/article/details/119533718)
3. [nodejs漏洞华丽变身webshell实现持久化](https://www.jianshu.com/p/9280da67ab3d)


