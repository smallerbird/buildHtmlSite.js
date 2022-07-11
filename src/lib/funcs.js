function formatDate(millisecond, template) {
    var res = "";
    try {
      var date = new Date(millisecond);
      var opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
      };
      template = template || "YYYY-mm-dd";
      for (var k in opt) {
        var ret = new RegExp("(" + k + ")").exec(template);
        if (ret) {
          template = template.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      res = template;
    } catch (error) {
      console.warn("ERROR formatDate", error);
    }
    return res;
  }

  // 简易打印日志
function log(info){
    let t=formatDate(new Date(), "YYYY-mm-dd HH:MM:SS")
    let msg=`[${t}]:`+info
    console.log(msg)
}


  module.exports={
    formatDate,log
}