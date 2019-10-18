const fs = require('fs')
const path = require('path')
// 上传图片封装方法
function uploads (imgRes, dir = '') {
	// 可以获取文件的临时目录
	let tmpPath = imgRes.path
	// 文件上传的指定目录
	let ext = path.extname(imgRes.originalname)
	let newName = '' + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext
	let newPath = '/upload/' + dir + '/' + newName
	//进行文件拷贝
	let fileData = fs.readFileSync(tmpPath)
	fs.unlinkSync(tmpPath, function (err) {
		if (err) {
			return ''
		}
	})
	fs.writeFileSync(__dirname + '/..' + newPath, fileData)
	return newPath
}

module.exports = uploads