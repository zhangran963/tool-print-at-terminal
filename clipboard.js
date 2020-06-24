const { exec } = require('child_process');

/**
 * 复制字符串到剪切板
 * @param {string} str 复制的内容
 */
function copyToClipBoard(str = '') {
	return new Promise((resolve, reject) => {
		const cmd = `echo '${str}' | pbcopy`;
		exec(cmd, (err, std) => {
			if (err) {
				reject(err);
			} else {
				resolve(std);
			}
		});
	});
}

module.exports = {
	copyToClipBoard,
};
