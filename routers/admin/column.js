// 导入express框架
let express = require('express')
// 实例化路由类
let router = express.Router()

router.get('/', function (req, res, next) {
	res.send('栏目管理')
})

module.exports = router