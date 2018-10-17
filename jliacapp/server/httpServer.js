/**
 * 
 * @authors Lv Hongbin (hblvsjtu@163.com)
 * @date    2018-10-07 22:14:27
 * @version 1.0.0
 * @description test for run python 
 */

const http = require('http');
const fs = require('fs');
var httpServerTool = require('./httpServerTool.js');
const MongoClient = require('mongodb').MongoClient;

 // Connection URL
 const mongodbURL = 'mongodb://localhost:27017';

 // Database Name
 const dbName = 'myproject';

//创建http server
const server = http.createServer((req, res) => {

    // 设置响应头
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.setHeader('Set-Cookie', ['system=Mac', 'tool=node']);
 
    // 打印信息
    httpServerTool.printInfo(req, res);

    // 处理请求
    var urlReq = req.url.toString().slice(1);
    if (urlReq === 'index.html') {
        urlReq = 'dist/' + urlReq;
    	httpServerTool.sendLocalFile(req, res, urlReq);
    }
    // 处理资源文件的请求
    else if (urlReq.match(/^(css)|(img)|(js)|(favicon)/)) {
    	if(urlReq.match(/\.css$/)) {
    		res.setHeader('Content-Type', 'text/css');
    	}
    	else if(urlReq.match(/\.js$/)) {
    		res.setHeader('Content-Type', 'application/x-javascript');
    	}
    	else if(urlReq.match(/\.png$/)) {
    		res.setHeader('Content-Type', 'application/x-png');
    	}
    	else if(urlReq.match(/\.woff/)) {
    		res.setHeader('Content-Type', 'application/x-font-woff');
    	}
        urlReq = './dist/' + urlReq;
    	httpServerTool.sendLocalFile(req, res, urlReq);
    }

    // 处理数据提交后的处理
    else if (urlReq.match(/^submitData/)) {
	    let chunks = [];
	    // 打印请求数据包
	    req.on('data', (chunk) => {
	        chunks.push(chunk);
	    });

	    req.on('end', () => {

	    	//index.html 中的表格参数转换成对象类型
	    	// var paramObj = httpServerTool.parseParam(decodeURIComponent(chunks.toString()));
      //       if (paramObj) {
      //           for (let key in paramObj) {
      //               console.log(`表格参数： ${key} = ${paramObj[key]}`);
      //           }
      //       }

            // 将post的数据转化成对象
            var paramObj = JSON.parse(chunks.toString());
            console.log(paramObj);

            var readResult = function(res) {
                // 读取结果文件
                fs.readFile('./text.txt', 'utf8', (err, data) => {
                    if (err) throw err;
                    httpServerTool.ACAORes(res, 'success!\n' + data);
                });
            }

            // 加上{flag: 'a'}变成追加模式
            fs.writeFile('./server/input/input.txt', chunks.toString(), function (err) {
               if(err) {
                console.error(err);
                } else {
                   console.log('写入成功');
                    // 运行python程序，
                    // 第一个参数是python文件的全路径；
                    // 第二个参数及后面所有的参数都是python的参数
                    console.log('执行python文件前');
                    httpServerTool.runPython(res, readResult, './test.py', JSON.stringify(paramObj));
                    console.log('执行python文件后');
                }
            });
	    });
    }
    else {
    	res.writeHead(200, {
	        'Content-Type': 'text/plain'
	    });
	    res.write('welcome!\n\r');
    }

    req.on('error', () => {
        console.log(`error: ${error}`);
    });

    // 设置超时时间5s 5*1000=5000
    res.setTimeout(5000);
    res.on('timeout', () => {
        console.log('oh no! timeout');
        res.end('ok');
    });

});

// http协议升级时使用
server.on('upgrade', (req, socket, head) => {
    socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        '\r\n');

    socket.pipe(socket);
});

// 设置错误监听
server.on('clientError', (err, socket) => {
    console.log(`err = ${err}`)
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});


// 设置监听端口和回调函数
server.listen(8080, () => console.log('The http server is listening!'));




