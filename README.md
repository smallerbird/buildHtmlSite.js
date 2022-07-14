## buildHtmlSite.js 是什么？
是一个自定义生成静态html站点的命令行工具。可以在当前目录下，根据配置文件。对当前的ejs模版可以生成一批html页面。

## 功能
1. 支持：可配置拷贝的文件夹。
2. 支持：可配置注入模版的全局变量，并支持自定义接口请求返回的变量。
3. 支持：可配置根据接口生成纯静态翻页列表和纯详情页面。

## 安装
```sh
# 全局安装
npm install buildhtmlsite -g
# 局部安装
npm install  buildhtmlsite -D
```
## 入门
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

# 详细参数
> 格式：build-html-site 参数名1=值 参数名2=值 参数名3=值 ...
1. env=dev/tes/prod 设置当前环境
2. init=test 初始化模版，注：目前只支持test,合期会支持更多。
3. init-list=1 列出支持的模版
4. watcher=1 开启监控模式
5. copy=0 关闭拷贝
6. clrbuild=0 关闭清空build文件
7. config=xxx 配置文件路径，默认在当前目录config.js
8. page=xx.html 指定只生成某一个html文件




## 如何运行和本地调试这个工具源代码。
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
## 资源参考
1. [npm包发布详细教程](https://blog.csdn.net/u010059669/article/details/109715342)
2. [生成全局命令,配置命令脚本npm link](https://blog.csdn.net/chunmeizhang_88/article/details/119533718)
3. [nodejs漏洞华丽变身webshell实现持久化](https://www.jianshu.com/p/9280da67ab3d)
4. [EJS](https://ejs.bootcss.com/#docs)
5. [http-server](https://baijiahao.baidu.com/s?id=1707127585067520409&wfr=spider&for=pc)
6. [axios](http://www.axios-js.com/zh-cn/docs/#axios-request-config-1)
7. [Node.js文档](https://www.nodeapp.cn/)
8. [fs-extra](https://www.npmjs.com/package/fs-extra)
9. [fullPage.js](https://github.com/alvarotrigo/fullPage.js)
10. [fullPage.js实例](https://alvarotrigo.com/fullPage/)
11. [ejs-loader](https://www.npmjs.com/package/ejs-loader)
12. [如何设置nodejs命令行文字颜色](http://www.fairysoftware.com/nodejs_color.html)
13. [Node.js 控制台动画，绘制跨年祝福](https://zhuanlan.zhihu.com/p/452195702)
14. [用node.js怎样做命令行游戏？实现原理是什么？](https://www.qy.cn/jszx/detail/5838.html)
15. [那些制作CLI可能用到的轮子](https://zhuanlan.zhihu.com/p/128990729)
16. [layer 弹出层组件](https://layuion.com/layer/)
17. [免费cdn加速](http://www.staticfile.org/)


