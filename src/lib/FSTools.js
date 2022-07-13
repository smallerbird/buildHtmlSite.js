
const fs=require('fs');
const Path=require('path');
const readFile = function (file,data={}){
    return new Promise(function (resolve, reject){
        fs.readFile(file, function(err, data){
            if (err) reject(err);
            resolve(data);
        });
    });
};
const readDir = function (file){
    return new Promise(function (resolve, reject){
        fs.readdir(file, function(err, data){
            if (err) reject(err);
            resolve(data);
        });
    });
};
const exists=function(file){
    return new Promise(function (resolve, reject){
        fs.access(file,fs.constants.F_OK,function(err, data){
            if (err){
                resolve(false)
            }else{
                resolve(true)
            }
        });
    });
}


const writeFile = function (file,content){
    return new Promise(function (resolve, reject){
        fs.writeFile(file,content,{flag:'w',encoding:'utf8'}, function(err, data){
            if (err) reject(err);
            resolve(data);
        });
    });
};

//获取文件fs.Stats 类
//http://nodejs.cn/api/fs.html#fs_class_fs_stats
function lstat(path) {
    return new Promise(function (resolve, reject){
        fs.lstat(path, function(err, data){
            if (err) reject(err);
            resolve(data);
        });
    });
}

async function isDirectory(path) {
    var stat=await lstat(path)
    var isDirectory=stat.isDirectory();
    return isDirectory;
}

//建立多级目录
const mkdir=function(dirpath){
    return new Promise(function (resolve, reject){
        fs.mkdir(dirpath, function(err, data){
            if (err) reject(err);
            resolve(data);
        });
    });
}

//删除目录
const rmdir=function(dirpath){
    return new Promise(function (resolve, reject){
        fs.rmdir(dirpath, function(err, data){
            if (err) reject(err);
            resolve(data);
        });
    });
}
/**
 * 删除整个文件夹
 * @param {*} path
 */
 function rmDir(path) {
    new Promise(async (resolve) => {
      if (fs.existsSync(path)) {
        const dirs = [];
  
        const files = await fs.readdirSync(path);
  
        files.forEach(async (file) => {
          const childPath = path + "/" + file;
          if (fs.statSync(childPath).isDirectory()) {
            await rmDir(childPath);
            dirs.push(childPath);
          } else {
            await fs.unlinkSync(childPath);
          }
        });
  
        dirs.forEach((fir) => fs.rmdirSync(fir));
  
        resolve();
      }
    });
  }
//创建多级目录
const mkdirx= async function(rootPath,dirpath){
    console.log('mkdirx:',rootPath,dirpath)
    var arrDir=dirpath.split('/');
    var temPth=rootPath;
    for (var i=0;i<arrDir.length;i++){
        temPth=Path.resolve(temPth,'./'+arrDir[i]);
        let isExists=await exists(temPth)
        console.log('建立目录:[是否存在'+isExists+']'+temPth)
        if (!isExists){ //如果存在就建立目录
            console.log('建立成功..')
            await mkdir(temPth);
        }
    }
}

//遍历目录下的所有文件
async function foreachFile(path,callbak) {
    let fileList=await readDir(path);
    let c=fileList.length;
    for (var i=0;i<c;i++){
        let filename=fileList[i];
        let currentFilePath=Path.resolve(path,'./'+filename)
        let isD=await isDirectory(currentFilePath)
        if (isD){
            await foreachFile(currentFilePath,callbak);
        }else{
            callbak({filePath:currentFilePath,fileName:filename})
        }
    }
}

function isEmptyDir(dirname) {
    return fs.promises.readdir(dirname).then(files => {
        console.log("aaaa:",files)
        let c=0
        for(let i=0;i<files.length;i++){
            if(files=='.DS_Store'){
                c++
            }
        }
        let count=files.length-c
        return count<=0;
    });
}


module.exports={
    readFile,readDir,exists,writeFile,lstat,isDirectory,mkdir,rmdir,rmDir,mkdirx,foreachFile,isEmptyDir
}