'use strict';

/**
 * 
 * @authors Lv Hongbin (hblvsjtu@163.com)
 * @date    2018-10-08 01:16:44
 * @version $Id$
 * @toolfor run python
 */
const querystring = require('querystring');
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const url = require('url');
// 打印信息
function printInfo(req, res) {
    // 打印请求信息
    const header = req.headers;
    var queryParam = url.parse(req.url, true).query;
    console.log('\n\r打印header...');
    for (let props in header) {
        console.log(`${props} = ${header[props]}`);
    }
    console.log(`req.url = ${req.url}`);
    console.log(`req.method = ${req.method}`);
    console.log(`req.httpVersions = ${req.httpVersions}`);
    

    // 打印cookie
    console.log('\n\r打印cookie...');
    const cookie = parseCookie(header.cookie);
    for (let key in cookie) {
        console.log(`${key} = ${cookie[key]}`);
    }

    // 打印IP地址
    const ip = res.socket.remoteAddress;
    const port = res.socket.remotePort;
    console.log(`你的IP地址是 ${ip}，你的源端口是 ${port}。`);

    // 获取路径对象
    const clientPath = url.parse(req.url, true);

    // 获取参数对象
    console.log('\n\r打印参数对象...');
    const param = clientPath.query;
    for (let props in param) {
        console.log(`${props} = ${param[props]}`);
    }
}
exports.printInfo = printInfo;

// 转换cookies为对象
function parseCookie(cookie) {
    let cookies = {};
    if (!cookie) {
        return cookies;
    } else {
        let list = cookie.split(';');
        let i;
        let length = list.length;
        for (i = 0; i < length; i++) {
            let pair = list[i].split('=');
            let key = pair[0].trim();
            let name = pair[1].trim();
            cookies[key] = name;
        }
        return cookies;
    }
}
exports.parseCookie = parseCookie;

// 发送客户端请求的文件
var sendLocalFile = function sendLocalFile(req, res, fileName) {
    // 获取文件流对象
    var raw = fs.createReadStream('./' + fileName);
    // 允许接收的编码类型
    var encoding = req.headers['accept-encoding']; //这里要全小写
    if (!encoding) {
        encoding = '';
    }

    // 获取请求头中的修改时间
    var ifModifiedSince = req.headers['if-modified-since']; //这里要全小写

    if (!ifModifiedSince) {
        ifModifiedSince = '';
    }

    // 获取请求头中的if-none-match
    var ifNoneMatch = req.headers['if-none-match']; //这里要全小写

    var gzip = zlib.createGzip();
    var deflate = zlib.createDeflate();

    // 利用ETag和hash值判断是否需要缓存
    fs.readFile('./' + fileName, function (err, fd) {

        // 获取文件的hash值
        var hash = crypto.createHash('sha256');
        hash.update(fd);
        var hashsum = hash.digest('hex');
        console.log('hash = ' + hashsum);
        if (hashsum == ifNoneMatch) {

            // 没有过期
            console.log('没有过期');
            res.writeHead(304, 'Not Modified');
        } else {

            // 已经过期
            console.log('已经过期');
            var expires = new Date();
            expires.setTime(expires.getTime + 10 * 1000); //10秒
            res.setHeader('Expires', expires.toUTCString());
            res.setHeader('Cache-Control', 'max-age=' + 10 * 1000); //10秒
            res.setHeader('ETag', hashsum);
            if (/\bdeflate\b/.test(encoding)) {
                res.writeHead(200, {
                    'Content-Encoding': 'deflate'
                });
                raw.pipe(deflate).pipe(res);
            } else if (/\bgzip\b/.test(encoding)) {
                res.writeHead(200, {
                    'Content-Encoding': 'gzip'
                });
                raw.pipe(gzip).pipe(res);
            } else {
                res.writeHead(200, {});
                raw.pipe(res);
            }
        }
    });
};
exports.sendLocalFile = sendLocalFile;

// 把table参数转换为对象格式
var parseParam = function parseParam(param) {
    var params = {};
    if (!param) {
        return params;
    } else {
        var list = param.split('&');
        var i = void 0;
        var length = list.length;
        for (i = 0; i < length; i++) {
            var pair = list[i].split('=');
            var key = pair[0].trim();
            var name = pair[1].trim();
            params[key] = name;
        }
        return params;
    }
};
exports.parseParam = parseParam;

//调用python程序
var runPython = function runPython(res, callback, fileName) {
    var exec = require('child_process').exec;
    var len = arguments.length;
    var command = 'python ';
    for (var i = 2; i < len; i++) {
        command += ' ' + arguments[i];
    }
    console.log('command = ', command);
    exec(command, function (error, stdout, stderr) {
        if (stdout.length > 1) {
            console.log('you offer args:', stdout);
        } else {
            console.log('you don\'t offer args');
        }
        if (error) {
            console.info('stderr : ' + stderr);
        };
        callback(res);
    });
};
exports.runPython = runPython;

const ACAORes = function(res, str) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //支持全域名访问，不安全，部署后需要固定限制为客户端网址
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE'); //支持的http 动作
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type'); //响应头 请按照自己需求添加。
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset="utf-8"'
    })
    res.write(str);
    res.end();
}
exports.ACAORes = ACAORes;

var uploadFile = function(req, fileName, encode) {
    let chunks = [];
    // 打印请求数据包
    req.on('data', (chunk) => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        fs.writeFile('./server/input/' + fileName, chunks, encode, function (err) {
            if(err) {
            console.error(err);
            } else {
               console.log('写入成功');
           }
        })
    });
}
exports.uploadFile = uploadFile;

var downloadFile = function (res, fileName) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //支持全域名访问，不安全，部署后需要固定限制为客户端网址
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE'); //支持的http 动作
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type'); //响应头 请按照自己需求添加。
    fs.exists('./server/input/' + fileName, function(exists) {
        if(exists) {
            fs.readFile('./server/input/' + fileName, (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    // httpServerTool.ACAORes(res, 'success!\n' + data);
                    res.writeHead(200, {
                        'Content-Type': 'multipart/form-data'
                    })
                    res.write(data);
                    res.end();
                }
            });
        }
        else {
            // httpServerTool.ACAORes(res, 'success!\n' + data);
            console.log('this file does not exist');
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.write('this file does not exist');
            res.end();
        }
    })
}
exports.downloadFile = downloadFile;



