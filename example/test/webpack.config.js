const path = require('path');
let outPath1=path.resolve(__dirname,'assets')
module.exports = {
  entry:'./test.js',//入口
  output:{
      path:outPath1,//根路径
      filename:'test.js'//出口文件名
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: false,
    open: true,
    port: 9090,
  },
};