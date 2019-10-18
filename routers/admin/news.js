// 导入express框架
let express = require('express')
// 实例化路由类
let router = express.Router()
// 导入数据库模块
const mysql = require('../../config/db.js')
// 图片上传模块
const multer = require('multer')
const upload = multer({dest: 'temp/'})
const uploads = require('../../common/uploads.js')
const moment = require('moment')
const pages = require('../../common/pages.js')
// 导入fs模块
const fs = require('fs')

router.get('/', function (req, res, next) {
	let page = req.query.page ? req.query.page : 1
	let size = 5
	let search = req.query.search ? req.query.search : ''
	mysql.query('select count(*) tot from news, newstype where news.title like ? and news.cid = newstype.id', [`%${search}%`], function (err, data) {
		if (err) {
			return ''
		} else {
			let tot = data[0].tot
			let fpage = pages(tot, page, size, search)
			// 从数据库中查询数据
			mysql.query('select news.*, newstype.name tname from news, newstype where news.title like ? and news.cid = newstype.id order by news.id desc limit ?, ?', [`%${search}%`, fpage.start, fpage.size], function (err, data) {
				// 判断是否执行成功
				if (err) {
					return ''
				} else {
					data.forEach(item => {
						item.time = moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')
					})
					res.render('admin/news/index.html', {data: data, search: search, show: fpage.show})
				}
			})
		}
	})
})
// 添加页面
router.get('/add', function (req, res, next) {
	mysql.query('select * from newstype order by sort desc', function (err, data) {
		if (err) {
			return ''
		} else {
			res.render('admin/news/add.html', {data: data})
		}
	})
})
// 新闻管理添加功能
router.post('/add', upload.single('img'), function (req, res, next) {
	let imgRes = req.file
	let {title, keywords, description, info ,author, cid, text} = req.body
	let num = 0
	let time = Math.round((new Date().getTime()) / 1000)
	// 进行图片上传
	let img = uploads(imgRes, 'news')
	// 进行数据插入
	mysql.query('insert into news(title, keywords, description, info, author, cid, text, num, time, img) value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, keywords, description, info, author, cid, text, num, time, img], function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				res.send('<script>alert("添加成功"); location.href = "/admin/news"</script>')
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
	mysql.query('delete from news where id = ?', [id], function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				// 删除图片
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
	mysql.query('select * from newstype order by sort desc', function (err, data) {
		if (err) {
			return ''
		} else {
			mysql.query('select * from news where id = ?', [id], function (err, data2) {
				if (err) {
					return ''
				} else {
					res.render('admin/news/edit.html', {data: data, newsData: data2[0]})
				}
			})
		}
	})
})
// 修改功能
router.post('/edit', upload.single('img'), function(req, res, next) {
	// 接收图片信息
	let imgRes = req.file
	// 接收表单数据
	let {title, keywords, description, info, author, cid, id, oldImg, text} = req.body
	// 判断图片资源是否存在
	let img = oldImg
	if (imgRes) {
		// 先上传图片
		img = uploads(imgRes, 'news')
	}
	sql = 'update news set cid = ?, text = ?, author = ?, info = ?, description = ?, keywords = ?, title = ?, img = ? where id = ?'
	arr = [cid, text, author, info, description, keywords, title, img, id]
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
				res.send('<script>alert("修改成功"); location.href="/admin/news"</script>')
			} else {
				res.send('<script>alert("修改成功"); history.go(-1)</script')
			}
		}
	})
})

module.exports = router