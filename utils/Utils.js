const fs = require('fs')
const path = require('path')
const getDir = require('../config/fileDir')

exports.types = {
    isString : obj => (Object.prototype.toString.call(obj) === '[object String]'),
    isNumber : obj => (Object.prototype.toString.call(obj) === '[object Number]'),
    isArray : obj => (Object.prototype.toString.call(obj) === '[object Array]'),
    isDate : obj => (Object.prototype.toString.call(obj) === '[object Date]'),
    isFunction : obj => (Object.prototype.toString.call(obj) === '[object Function]'),
}

/**
 * 同步创建多个文件夹
 * @param dirName
 * @return {boolean}
 */
exports.mkdirsAsync = dirName => {
    if (fs.existsSync(dirName)) {
        return true;
    } else {
        if (this.mkdirsAsync(path.dirname(dirName))) {
            fs.mkdirSync(dirName);
            return true;
        }
    }
}

exports.saveFile = (fileLists, path) => {
    let officialPath = null
    let officialDirPath = null
    let pathCopy = null
    let pathCopyArr = null
    if (fileLists.indexOf(',') !== -1) {
        let arr = []
        fileLists.split(',').map((v, k) => {
            if (v.indexOf('temp') !== -1) {
                pathCopy = v
                pathCopyArr = pathCopy.split('/')
                pathCopyArr.pop()
                officialPath = v.replace('temp',path)
                officialDirPath = (pathCopyArr.join('/')).replace('temp', path)
                this.mkdirsAsync(`./${officialDirPath}`);
                let sourcePath = `./${v}`
                let targetPath = `./${officialPath}`
                this.moveFile(sourcePath, targetPath, () => {  })
            }
            arr.push(officialPath.slice(7))
        })
        return arr
    } else {
        if (fileLists.indexOf('temp') !== -1) {
            pathCopy = fileLists
            pathCopyArr = pathCopy.split('/')
            pathCopyArr.pop()
            officialPath = fileLists.replace('temp',path)
            officialDirPath = (pathCopyArr.join('/')).replace('temp', path)
            this.mkdirsAsync(`./${officialDirPath}`);
            let sourcePath = `./${fileLists}`
            let targetPath = `./${officialPath}`
            this.moveFile(sourcePath, targetPath, () => {  })
        }
        return [officialPath.slice(7)]
    }
}


/**
 * node移动文件工具函数
 * @param sourcePath 文件原始位置
 * @param targetPath 要移动到的路径
 * @param onSuccess 成功移动之后的回调
 */
exports.moveFile = (sourcePath, targetPath, onSuccess) => {
    let fileReadStream = fs.createReadStream(sourcePath);
    let fileWriteStream = fs.createWriteStream(targetPath);
    fileReadStream.pipe(fileWriteStream);
    fileWriteStream.on('close', () => { onSuccess() })
}

/**
 * 获取随机字符串
 * @return string 随机生成的字符串
 */
exports.getRandomStr = () => (Math.random().toString(36).substr(2, 15))