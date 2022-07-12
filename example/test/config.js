/**
 * 站点配置
 */
module.exports=(argConfig)=>{

    let apiHost="http://localhost:8080/"
    
    let {env}=argConfig
    //根据不同环境设置不同接口前缀，可以用这个变量
    let baseURL="";
    if(env=="dev"){
        apiHost=""
    }else if(env=="tes"){
        apiHost=""
    }else if(env=="prod"){
        apiHost=""
    }
    let returnData={
        out:'../build/',
        copy:[ //配置需要拷贝的文件夹
            {from: "assets",to: "assets"}
        ],
        request:[ //可以配置请求的接口返回数据，并注入到模板中
            {
                key:"api_global",
                url:apiHost+"global.json",
                method:"GET",
                data:{},
                params:{type:0}
            }
        ],
        data:{//公共数据
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
            },
            {
                outFileName:"dataview.html", // 生成后的文件名
                template:"dataview.html", // 模板
                data:{  //专有数据
                    title:"查看标题",
                }
            }
        ],
    
}




//注入当前环境变量
returnData.data.ENV=env
return returnData

}