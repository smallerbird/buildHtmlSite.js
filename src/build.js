async function build(){
    var fs = require('fs'),path=require('path'),eJs = require("eJs");
    var chokidar = require('chokidar');
    const fse = require('fs-extra')
    const axios=require('axios')
    var fsTool=require("./lib/FSTools")
    
    const funcs=require("./lib/funcs")

    funcs.log("工作所处位置："+__dirname)
    funcs.log("当前命令运行时目录："+process.cwd())
    const args = process.argv.slice(2);
    //返回的结果： [ 'page=index.html', 'env=dev' ]
    funcs.log("运行参数："+JSON.stringify(args))
    //可以通过的参数清单
    let strrgKey='page,env,watcher,copy,clrbuild,config,init-list,init'
    let obj1={}
    strrgKey.split(',').map((item)=>{
        obj1[item]=true
    })
    let argConfig={}
    for(let i=0;i<args.length;i++){
        let item=args[i]
        let arr=item.split('=')
        if(arr.length!=2){
            funcs.log("参数格式不对，应为： 参数=值")
            return;
        }
        if(obj1[arr[0]]){ //过滤有用参数
            argConfig[arr[0]]=arr[1]
        }
    }
    funcs.log("运行参数 argConfig："+JSON.stringify(argConfig))

    //模版列表
    let strInitList="test"
    let initList=strInitList.split(",")
    let isFindInit=false
    for(let i=0;i<initList.length;i++){
        if(initList[i]==argConfig.init){
            isFindInit=true;
            break;
        }
    }
    if(isFindInit){
        funcs.log("init参数格式不对，应为： 参数=值")
        return;
    }


    if(!argConfig['config']) argConfig['config']='./config.js'
    let configFile=path.resolve(process.cwd(), argConfig['config'])

    funcs.log("检测配置文件:"+configFile)


    let isHave=await fsTool.exists(configFile)
    if(!isHave){
        funcs.log("!!!!!!!!!!!! 缺少配置文件  config.js")
        return;
    }


    let configDo=require(configFile)
    let config=configDo(argConfig)






    //转换相对坐标为绝对坐标。
    function toResolvePath(url){
        return path.resolve(process.cwd(), url)
    }




    
    function eJs2HTML(templatePath,outPath,information) {
        fs.readFile(templatePath,'utf8',function (err,data) {
            if (err) { console.log(err); return false; }
            // var eJs_string = data,template = eJs.compile(eJs_string,{context:context}),HTML = template(information);

            let HTML=eJs.render(data, information,{
                filename:templatePath
            });
            fs.writeFile(outPath,HTML,function(err) {
                if(err) { console.log(err); return false }
                return true;
            });  
        });
    }


    const run=async function(){
        var start = new Date().getTime();
    
        let isclrbuild=true
        if(argConfig.clrbuild&&argConfig.clrbuild=='0'){
            isclrbuild=false
            funcs.log("取消：清空build文件夹")
        }
        if(isclrbuild){
            //创建build文件夹
            // let build=path.resolve(__dirname, config.out)
            let build=toResolvePath(config.out)
            let isExists=await fsTool.exists(build)
            if (isExists){ //如果存在就删除
                fse.removeSync(build)
            }
            await fsTool.mkdir(build);
            funcs.log("执行：清空build文件夹")
        }
        
        //
        let isCopy=true
        if(argConfig.copy&&argConfig.copy=='0'){
            isCopy=false
            funcs.log("取消：拷贝操作")
        }
        if(isCopy){
            //拷贝
            for(let i=config.copy.length-1;i>=0;i--){
                let copyItem=config.copy[i]
                // await fse.copy(
                //     path.resolve(__dirname,'./'+copyItem.from),
                //     path.resolve(__dirname,config.out+copyItem.to),
                //     )
                await fse.copy(
                    toResolvePath('./'+copyItem.from),
                    toResolvePath(config.out+copyItem.to),
                )
            }
            funcs.log("拷贝操作")
        }
        
    

        let requestData={}
        //请求所有接口数据
        const instance = axios.create()
        let configRequest=config.request
        // console.log("configRequest:",configRequest,configRequest.length)
        for(let i=configRequest.length-1;i>=0;i--){
            let item=configRequest[i]
            try{
                let resData=await instance.request(item)
                // console.log("全局 resData :",resData.data)
                resData.data.OK=true
                requestData[item.key]=resData.data
            }catch(e){
                requestData[item.key]={
                    OK:false,
                    errs:{
                        type:"request",
                        msg:"请求接口错误",
                        url:item.url,
                        requestData:JSON.item,
                        resData:e
                    }

                }
                console.log("请求接口错误:"+item.url,"---==接口信息==---",JSON.stringify(item),"---==错误信息==--",JSON.stringify(e))
                
            }
        }



        //全局变量
        let pubdata={}
        if(config.data) pubdata=config.data
        pubdata.requestData=requestData
        
        let pages=config.pages
        for(let i=pages.length-1;i>=0;i--){
            let item=pages[i]

            //当前页面是不是生成:注从命令行传过来，调试用，只生成一个页面
            let template=item.template
            let isCreate=true
            if(argConfig.page){
                if(template==argConfig.page){
                    isCreate=true
                }else{
                    isCreate=false
                }
            }


            


        if(isCreate){

                //页面变量
                let itemData={}
                if(item.data) itemData=item.data

                //请求
                let currentPageRequestData={}
                if(item.request){
                    let configRequest=item.request
                    // console.log("configRequest:",configRequest,configRequest.length)
                    for(let i=configRequest.length-1;i>=0;i--){
                        let item=configRequest[i]
                        let resData=await instance.request(item)
                        currentPageRequestData[item.key]=resData.data
                        // console.log("局部 resData :",resData.data)
                    }
                }

                let pageData={...pubdata,...itemData}
                if(item.request){
                    //合并requestData 数据
                    pageData.requestData={...pageData.requestData,...currentPageRequestData}
                }

                
                let outFilex=toResolvePath(config.out+item.outFileName)
                funcs.log("生成："+outFilex)
                
                eJs2HTML(
                    toResolvePath('./'+item.template),
                    outFilex,
                        {
                            data:pageData
                        }
                )

        }
            

        }

        var end = new Date().getTime();
        funcs.log("耗时："+ (end-start) + " 毫秒")
    }

    run()
    //检查是否开启 watcher模式
    let watchPath=toResolvePath('./')
    if(argConfig.watcher&&argConfig.watcher=='1'){
        funcs.log("开启监控模式..")
        funcs.log("监控文件改动中...")
        var watcher = chokidar.watch(watchPath, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        watcher.on('change', path =>{
            run()
            funcs.log("监控文件改动中...")
        })

    }

}
module.exports=build