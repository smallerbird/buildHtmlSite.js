
let path=require('path'),fs = require('fs')
let configFile=path.resolve(process.cwd(),'./config.js')
// console.log("configFile:",configFile)
let configDo=require(configFile)
module.exports=(argConfig)=>{
    let config=configDo(argConfig)
    //引用之前的配置，pipe
    //自定义自定义的接口请求方法，默认为：axios.create().request 注：自定义需要返回一个promise
    config.requestApi=function(requestParams){
        //根据不同路径，返回预设的结果。
        let url=requestParams.url
        let isFind=false
        if(url.indexOf('global.json')!=-1){
            isFind=true;
            resultData=JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./mockapi/global.json')));
        }else if(url.indexOf('newspage.json')!=-1){
            isFind=true;
            resultData=JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./mockapi/newspage.json')));
        }else if(url.indexOf('index.json')!=-1){
            isFind=true;
            resultData=JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./mockapi/index.json')));
        }

        // console.log("requestApi:",requestParams.url,isFind,resultData)

        return new Promise(function(resolve, reject){
            // ... some code
            if(isFind){
                resolve({data:resultData})
            }else{
                //如果返回false的会启动默认请求。
                reject(false)
            }
            
        })
        
    }








    return config
}
