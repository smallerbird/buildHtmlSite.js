/**
 * 站点配置
 */
module.exports=(argConfig)=>{

    let donwBaseURL="https://sysadmin.yuexinguoji.com/" //下载接口前缀
    let logBaseURL="https://sysadmin.yuexinguoji.com/" // 日志接口前缀
    
    let {env}=argConfig
    //根据不同环境设置不同接口前缀，可以用这个变量
    let baseURL="";
    if(env=="dev"){
        donwBaseURL='http://121.40.204.59:8443/'//开发
        logBaseURL='http://121.40.204.59:8443/'//开发
    }else if(env=="tes"){
        donwBaseURL='http://8.134.55.137:9527/'//测试
        logBaseURL='http://8.134.55.137:9527/'//测试
    }else if(env=="prod"){
        donwBaseURL='https://sysadmin.yuexinguoji.com/'//生产
        logBaseURL='https://sysadmin.yuexinguoji.com/'//生产
    }
    let returnData={
    out:'../build/',
    copy:[ //配置需要拷贝的文件夹
      {from: "assets",to: "assets"}
    ],
    request:[ //可以配置请求的接口返回数据，并注入到模板中
        /*{
            key:"newestVersion",
            url:"https://mobile.yuexinguoji.com/app/appVersion/newestVersion",
            method:"GET",
            data:{},
            params:{type:0}
        }*/
    ],
    data:{//公共数据
        donwBaseURL,logBaseURL,
        //seo
        seo_keywords:'seo_keywords xxx',
        seo_description:'seo_description xxx',
      
        d1:"我是全局变量"
    },
    //多页面配置
    pages:[
        {
            outFileName:"index.html", // 生成后的文件名
            template:"index.html", // 模板
            data:{  //专有数据
                title:"首页",
            }
        }
    ],
    
}




//注入当前环境变量
returnData.data.ENV=env
return returnData

}