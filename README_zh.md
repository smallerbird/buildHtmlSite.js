# buildHtmlSite.js
build hml file web site

# 开发
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


