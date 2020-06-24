const os = require('os');
let ifaces = os.networkInterfaces();

/**
 * 获取内网IP
 */
function getInnerIP() {
	let ip = null;
	for (var dev in ifaces) {
		ifaces[dev].forEach(function (details, alias) {
			if (details.family == 'IPv4') {
				const matchRes = details.address.match(/(\d{1,3}\.){3}\d{1,3}/g);
				let res = Array.isArray(matchRes) ? matchRes[0] : '';
				if (res.startsWith('192')) {
					ip = res;
				}
			}
		});
	}

	return ip;
}

module.exports = {
	getInnerIP,
};
