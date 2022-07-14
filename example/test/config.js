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
        out:'./build/',
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
            },
            {
                type:"pages", //如果生成翻页。
                //列表输出的文件名
                outFileName:function(page){
                    return "news"+page+".html"
                },
                //列表输出用的模版
                template:"news.html", 
                data:{  //专有数据
                    title:"翻页列表测试",
                },
                request:[ //可以配置请求的接口返回数据，并注入到模板中
                    {
                        // key:"newspage", // 因为这个接口只是用来获取页数，不会注入模版，所以不需要key
                        url:apiHost+"newspage.json",
                        method:"GET",
                        data:{},
                        params:{}
                    }
                ],
                config:{//针对page类型的其它配置
                    //从返回的接口中获取页数
                    getPageCount:function(requestData){
                        return requestData.data.pages
                    },
                    //每次翻页请求的接口
                    getPageRequestParams:function(page){
                        return {
                            key:"newsData",
                            url:apiHost+"newspage.json",
                            method:"GET",
                            data:{},
                            params:{page:page}
                        }
                    },
                    //内部循环给每个单页用到记录数组
                    getPageResultListData(onePageResData){
                        // console.log("getPageResultListData:",onePageResData)
                        //这里是对：mockapi/newspage.json 进行正确自定义的返回。
                        return onePageResData.data.records
                    },
                    //获得单条记录需要调的接口。
                    getDetailsRequestData:function(itemData,request){
                        //这里可以直接返回详情信息，
                        //1.如果之前传入列表接口数据（itemData），包含了需要数据就直接返回。
                        
                        return new Promise(function(resolve, reject){
                            // ... some code
                            resolve({
                                "code": "000000",
                                "mesg": "处理成功",
                                "time": "2022-07-11T09:32:10.251Z",
                                "data":itemData
                              })
                        })

                        //2.请求一个接口并返回。
                        //request为传的axios实例的请求接口方法。
                        /*return request({
                            key:"detailsData",
                            url:apiHost+"details.json",
                            method:"GET",
                            data:{},
                            params:{id:itemData.id}
                        })*/
                    },
                    //获取的详情数据，在模版变量的名称。
                    getDetailsRequestDataKey:"detailsData",
                    //详情输出用的模版
                    data:{  //专有数据
                        title:"详情页面测试",
                    },
                    templateDetails:"details.html",
                    outFileNameDetails:function(itemData){
                        return "details"+itemData.id+".html"
                    },
                }
            }
        ],
    
}




//注入当前环境变量
returnData.data.ENV=env









return returnData

}