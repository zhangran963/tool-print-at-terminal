var net = require('net');

/**
 * 检查端口号是否被占用
 * @param {number} port 端口号
 */
function usablePort(port = 3000) {
	return new Promise((resolve, reject) => {
		// 创建服务并监听该端口
		const server = net.createServer().listen(port);

		server.on('listening', function () {
			// 执行这块代码说明端口未被占用
			server.close(); // 关闭服务

			resolve(true);
			// console.log('The port【' + port + '】 is available.'); // 控制台输出信息
		});

		server.on('error', function (err) {
			if (err.code === 'EADDRINUSE') {
				// 端口已经被使用
				// console.log('The port【' + port + '】 is occupied, please change other port.');
				resolve(false);
			} else {
				reject(err);
			}
		});
	});
}

module.exports = {
	usablePort,
};
