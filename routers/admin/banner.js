// 导入express框架
let express = require('express')
// 实例化路由类
let router = express.Router()

const path = require('path')
// 设置文件上传
const multer = require('multer')
const upload = multer({dest: 'tmp/'})
// 导入fs模块
const fs = require('fs')
// 导入mysql模块
const mysql = require('../../config/db.js')
// 导入上传图片模块
const uploads = require('../../common/uploads.js')
// 首页
router.get('/', function (req, res, next) {
	let search = req.query.search ? req.query.search : ''
	// 朝招轮播图中的数据
	mysql.query('select * from banner where name like ? order by sort desc', [`%${search}%`], function (err, data) {
		if (err) {
			return ''
		} else {
			res.render('admin/banner/index.html', {data: data, search: search})
		}
	})
})
// 添加页
router.get('/add', function (req, res, next) {
	res.render('admin/banner/add.html')
})
// 处理添加功能
router.post('/add', upload.single('img'), function (req, res, next) {
	// 接收表单数据
	let {name, url, sort} = req.body
	// 接收文件相关数据
	let imgRes = req.file
	// 上传图片
	let img = uploads(imgRes, 'banner')
	// 讲数据插入到数据库中
	mysql.query('insert into banner(name, url, sort, img) value(?, ?, ?, ?)', [name, url, sort, img], function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				res.send('<script>alert("添加成功"); location.href="/admin/banner"</script>')
			} else {
				res.send('<script>alert("添加失败"); history.go(-1)</script>')
			}
		}
	})
})
// 无刷新删除数据
router.get('/ajax_del', function (req, res, next) {
	// 接收对应的数据
	let {id, img} = req.query
	// 修改数据
	mysql.query('delete from banner where id = ?', [id], function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				if (fs.existsSync(__dirname + '/../..' + img)) {
					fs.unlinkSync(__dirname + '/../..' + img)
				}
				res.send('1')
			} else {
				res.send('0')
			}
		}
	})
})
// 修改页面
router.get('/edit', function (req, res, next) {
	// 接收对应的数据
	let {id} = req.query
	// 查询数据
	mysql.query('select * from banner where id = ?', [id], function (err, data) {
		if (err) {
			return ''
		} else {
			res.render('admin/banner/edit.html', {data: data[0]})
		}
	})
})
// 修改功能
router.post('/edit', upload.single('img'), function(req, res, next) {
	// 接收图片信息
	let imgRes = req.file
	// 接收表单数据
	let {id, name, url, sort, oldImg} = req.body
	// 判断图片资源是否存在
	if (imgRes) {
		// 先上传图片
		let img = uploads(imgRes, 'banner')
		sql = 'update banner set name = ?, url = ?, sort = ?, img = ? where id = ?'
		arr = [name, url, sort, img, id]
	} else {
		sql = 'update banner set name = ?, url = ?, sort = ? where id = ?'
		arr = [name, url, sort, id]
	}
	// 发送sql语句
	mysql.query(sql, arr, function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				// 判断是否修改了图片
				if (imgRes) {
					if (fs.existsSync(__dirname + '/../..' + oldImg)) {
						fs.unlinkSync(__dirname + '/../..' + oldImg)
					}
				}
				res.send('<script>alert("修改成功"); location.href="/admin/banner"</script>')
			} else {
				res.send('<script>alert("修改成功"); history.go(-1)</script')
			}
		}
	})
})

module.exports = router