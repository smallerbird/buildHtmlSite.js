var fs = require('fs'),path=require('path'),eJs = require("ejs");
const fse = require('fs-extra')
const axios=require('axios')
var fsTool=require("./lib/FSTools")
let htmlMinifier=require('html-minifier')

const funcs=require("./lib/funcs")
// console.log("2222-11")
//一些配置信息都在这里
//可以接受哪些参数
const processArgv='page,env,watcher,copy,clrbuild,config,init-list,init'
//初始化模版
const templatePath='../example/'//模版位置


// 可先模版清单s
const templateList="test"

async function build(){
   
    var chokidar = require('chokidar');
   

    funcs.log("命令程序位置："+__dirname)
    funcs.log("当前命令运行时目录："+process.cwd())
    const args = process.argv.slice(2);
    //返回的结果： [ 'page=index.html', 'env=dev' ]
    funcs.log("运行参数："+JSON.stringify(args))
    //可以通过的参数清单
    let strargKey=processArgv
    let obj1={}
    strargKey.split(',').map((item)=>{
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

    


    


    if(!argConfig['config']) argConfig['config']='./config.js'
    let configFile=path.resolve(process.cwd(), argConfig['config'])
    

    if(argConfig["init-list"]){
        funcs.log("当前提供的模版:")
        let arr1=templateList.split(",")
        for(let i=0;i<arr1.length;i++){
            funcs.log(arr1[i])
        }
        funcs.log("请用命令进行设置：build-html-site init=模版")



        return;
    }

    if(argConfig["init"]){
        let tName=argConfig["init"]
        funcs.log("准备安装:"+tName)

        //模版列表
        let initList=templateList.split(",")
        let isFindInit=false
        for(let i=0;i<initList.length;i++){
            if(initList[i]==tName){
                isFindInit=true;
                break;
            }
        }
        if(!isFindInit){
            funcs.log("没有到这个模版："+tName+" 请用命令查询支持的模版: build-html-site init-list=1")
            return;
        }
        //当前目录是否空？
        let tDir=path.resolve(__dirname, templatePath,tName)
        let currentDir=process.cwd()
        let isEmpty=await fsTool.isEmptyDir(currentDir)
        funcs.log("检查目录"+currentDir+"为空:"+isEmpty)
        if(isEmpty){
            funcs.log("准备拷贝:"+tDir)
            await fse.copy(
                tDir,currentDir
            )
        }

        



        



        return;
    }

    funcs.log("检测配置文件#1:"+configFile)
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
            let minifyTip='压缩成功'
            //压缩html
            try{
                minifyTip='[压缩成功]'
                var minify = htmlMinifier.minify;
                HTML = minify(HTML, {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true
                });
            }catch(e){
                minifyTip='[压缩失败]'
                console.log("尝试压缩html:错误:"+JSON.stringify(e)+"\n ")
                console.log("压缩html为:")
                console.log(HTML)
            }
            funcs.log("生成"+minifyTip+":"+outPath)
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
            
            fse.emptyDirSync(build)

            /*let isExists=await fsTool.exists(build)
            if (isExists){ //如果存在就删除
                fse.removeSync(build)
            }
            await fsTool.mkdir(build);*/
            funcs.log("执行：清空build文件夹v2")
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
        const instance = axios.create()
        //如果有自定义的接口请求方法，就用自定义的的。
        let requestApi_default=instance.request
        let requestApi=requestApi_default
        if(config.requestApi){
            requestApi=config.requestApi
        }

        let configRequest=config.request
        // console.log("configRequest:",configRequest,configRequest.length)
        for(let i=configRequest.length-1;i>=0;i--){
            let item=configRequest[i]
            try{
                let resData=await requestApi(item)
                if(!resData){
                    //如果返回false,使用默认再试试。
                    resData=await requestApi_default(item)
                }
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
                // console.log("请求接口错误:"+item.url,"---==接口信息==---",JSON.stringify(item),"---==错误信息==--",JSON.stringify(e))
                
            }
        }



        //全局变量
        let pubdata={}
        if(config.data) pubdata=config.data
        pubdata.requestData=requestData
        
        let pages=config.pages
//这里把多页的抽出来，加工，转换成普通的page
let newAppendPages=[]
for(let i=pages.length-1;i>=0;i--){
    let item=pages[i]
    if(item.type=='pages'){
        
        //请求
        if(item.request){
            // console.log("configRequest:",configRequest,configRequest.length)
           
                let resData={}
                try{
                    resData=await requestApi(item.request[0])
                    if(!resData){
                        console.log("#2:")
                        //如果返回false,使用默认再试试。
                        resData=await requestApi_default(item.request[0])
                    }
                    resData.OK=true
                }catch(e){
                    console.log("!!!!!:",item.request[0])
                    console.log("处理类型为page出错:",e)
                    resData={
                        data:{
                            data:{},
                            OK:false,
                            errs:{
                                type:"request",
                                msg:"请求接口错误",
                                url:item.url,
                                requestData:JSON.item,
                                resData:e
                            }
                        }
                    }
                    // console.log("请求接口错误:"+JSON.stringify(e),"---==接口信息==---",JSON.stringify(item.request[0]),"---==错误信息==--",JSON.stringify(e))
                }
                let pageCount=item.config.getPageCount(resData.data)
                // console.log("pageCount:"+pageCount,resData)
                for(let page=1;page<=pageCount;page++){
                    //生成列表页面-----start
                    //创建一个新的
                    let newPage={
                        template:item.template,
                        data:item.data
                    }

                    let p=item.config.getPageRequestParams(page)
                    
                    let onePageResData=await requestApi(p)
                    if(!onePageResData){
                        //如果返回false,使用默认再试试。
                        onePageResData=await requestApi_default(p)
                    }


                    newPage.data[p.key]=onePageResData.data
                    newPage.outFileName=item.outFileName(page)

                    newAppendPages.push(newPage)
                    //生成列表页面-----end

                    //生成详情页面-----start
                    
                    let listData=item.config.getPageResultListData(onePageResData.data)
                    for(let d=0;d<listData.length;d++){
                        let detailsPage={
                            template:item.config.templateDetails,
                            data:JSON.parse(JSON.stringify(item.config.data)) //深度拷贝
                        }
                        
                        let itemData=JSON.parse(JSON.stringify(listData[d]))//深度拷贝

                        let detailsData=await item.config.getDetailsRequestData(itemData,instance.request)
                        
                        detailsPage.outFileName=item.config.outFileNameDetails(detailsData.data)
                       
                        detailsPage.data[item.config.getDetailsRequestDataKey]=detailsData.data
                        // console.log("生成详情页面222:",detailsPage.outFileName+":"+JSON.stringify(detailsPage.data[item.config.getDetailsRequestDataKey].content))
                        newAppendPages.push(detailsPage)
                    }
                    // 
                    
                    //生成详情页面-----end

                    




                }
                // console.log("局部 resData :",resData.data)
        }else{
            funcs.log("config.pages 发现type=='pages',但缺少request")
            return;
        }


    }
}


//如果加工有新的，就追加进去。
if(newAppendPages.length>0){
    pages=pages.concat(newAppendPages)
    // console.log("--------",newAppendPages)
    // console.log("加工以后的：",JSON.stringify(pages))
    // console.log("--------")
}







        for(let i=pages.length-1;i>=0;i--){
            let item=pages[i]
            //忽略这种类型的生成。
            if(item.type=='pages'){
                i--
                item=pages[i]
            }
            
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
                        let item1=configRequest[i]
                        let resData=await requestApi(item1)
                        if(!resData){
                            //如果返回false,使用默认再试试。
                            resData=await requestApi_default(item1)
                        }

                        currentPageRequestData[item1.key]=resData.data
                        // console.log("局部 resData :",resData.data)
                    }
                }

                let pageData={...pubdata,...itemData}
                if(item.request){
                    //合并requestData 数据
                    pageData.requestData={...pageData.requestData,...currentPageRequestData}
                }

                
                let outFilex=toResolvePath(config.out+item.outFileName)
               
                
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
        funcs.log("监控模式还在调式中，暂时关闭")
        /*funcs.log("开启监控模式..")
        funcs.log("监控文件改动中...")
        var watcher = chokidar.watch(watchPath, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        watcher.on('change', path =>{
            run()
            funcs.log("监控文件改动中...")
        })*/

    }

}
module.exports=build