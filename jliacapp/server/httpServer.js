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

	    	// index.html 中的表格参数转换成对象类型
	    	var paramObj = httpServerTool.parseParam(decodeURIComponent(chunks.toString()));
	    	for (let key in paramObj) {
		        console.log(`表格参数： ${key} = ${paramObj[key]}`);
		    }

            // 运行python程序，
            // 第一个参数是python文件的全路径；
            // 第二个参数及后面所有的参数都是python的参数
            console.log('执行python文件前');
		    httpServerTool.runPython('test.py', JSON.stringify(paramObj));
            console.log('执行python文件后');
            
            // 读取结果文件
		    fs.readFile('result.txt', 'utf8', (err, data) => {
              	if (err) throw err;
      	    	res.writeHead(200, {
      		        'Content-Type': 'text/html; charset=utf-8'
      		    });
      		    res.write('<h1>submitData!</h1>');
                 res.write('<h2>input' + '<h2>');
                for (let key in paramObj) {
                    res.write('<span style="font-size: 15px; color:red;">' + key + " = " + paramObj[key] + '</span><br>');
                }
                res.write('<br>执行python文件.....<br><br>');   
	      	    res.write('The results = <span style="font-size: 25px; color:red;">' + data + '</span><br>');
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




