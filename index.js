#! /usr/bin/env node
const http = require('http');
const { usablePort } = require('./port');
const { getInnerIP } = require('./inner-net');
const { copyToClipBoard } = require('./clipboard');
const [__a, __b, ...argvs] = process.argv;

const initStartPort = argvs.find((item) => Number.isInteger(parseInt(item)));

/**
 * 获取未占用的端口
 * @param {number} startPort 开始查询的端口
 */
function getUsablePort(startPort = initStartPort || 3001) {
	return usablePort(startPort)
		.then((isEmpty) => {
			/* startPort端口是否未占用 */
			if (isEmpty) {
				return startPort;
			} else {
				/* 检测下一个端口 */
				return getUsablePort(startPort + 1);
			}
		})
		.catch((err) => {
			console.log('err', err);
		});
}

/* 分割线 */
const dividerFunc = debounce(() => console.log('\n ***********'), 2000);

getUsablePort().then((port) => {
	/* 启动服务 */
	http
		.createServer(function (request, response) {
			/* 分割线 */
			dividerFunc();

			decodeUrl(request.url);

			response.end(`
        Address: ${request.socket.remoteAddress};
        Port: ${request.socket.remotePort}
      `);
		})
		.listen(port, () => {
			const address = `http://${getInnerIP()}:${port}`;
			copyToClipBoard(address)
				.then((std) => {
					console.log(`请将打印信息发送到: ${address} \n已复制此地址到剪切板`);
				})
				.catch((err) => {
					console.log(err);
				});
		});
});

function decodeUrl(url) {
	let paramsStr = url.replace('/?', '');
	paramsStr = decodeURIComponent(paramsStr);
	let params = paramsStr.split('&').reduce((obj, curr) => {
		let [key = 'key', value = ''] = curr.split('=');
		obj[key] = value;
		value = value.replace(/\s{2,}/g, '\n');
		// console.log(value)
		return obj;
	}, {});
	console.log(`${new Date().toISOString().replace(/[a-z\.]/gi, ' ')} \n`, params);
	// console.log(params)
}

/**
 * 短时间内多次触发, 仅触发一次
 * @param {function} fn 节流
 */
function debounce(fn, time = 1000) {
	let allow = true;
	return function (...args) {
		if (allow) {
			allow = false;
			setTimeout(() => (allow = true), time);
			fn(...args);
		}
	};
}
