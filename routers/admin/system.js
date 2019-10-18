// 导入express框架
let express = require('express')
// 实例化路由类
let router = express.Router()

const fs = require('fs')
// 上传图片设置
const multer = require('multer')
const upload = multer({dest: 'temp/'})
const uploads = require('../../common/uploads.js')

router.get('/', function (req, res, next) {
	// 读取文件中的内容
	let fileData = fs.readFileSync(__dirname + '/../../config/webConfig.json')
	let data= JSON.parse(fileData.toString())
	res.render('admin/system/index.html', {data: data})
})

// 系统管理的更新方法
router.post('/save', upload.single('logo'), function (req, res, next) {
	// 接收上传的资源
	let imgRes = req.file
	let {title, keywords, description, count, copyright, record, img} = req.body
	if (imgRes) {
		fs.unlinkSync(__dirname + '/../..' + img)
		img = uploads(imgRes)
	}
	// 格式化数据
	let data = {
		title: title,
		keywords: keywords,
		description: description,
		copyright: copyright,
		record: record,
		count: count,
		logo: img
	}
	fs.writeFileSync(__dirname + '/../../config/webConfig.json', JSON.stringify(data))
	res.send('<script>alert("修改成功"); location.href="/admin/system"</script>')
})

module.exports = router