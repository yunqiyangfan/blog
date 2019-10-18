// 导入express框架
let express = require('express')
// 实例化路由类
let router = express.Router()
// 导入数据库模块
let mysql = require('../../config/db.js')
// 分类查看页面
router.get('/', function (req, res, next) {
	// 从数据库查询相关数据
	mysql.query('select * from newstype order by sort desc', function (err, data) {
		if (err) {
			return ''
		} else{
			res.render('admin/type/index.html', {data: data})
		}
	})
})
// 分类添加页面
router.get('/add', function (req, res, next) {
	res.render('admin/type/add.html')
})
// 分类修改页面
router.get('/edit', function (req, res, next) {
	// 接收对应的数据
	let {id} = req.query
	// 查询数据
	mysql.query('select * from newstype where id = ?', [id], function (err, data) {
		if (err) {
			return ''
		} else {
			res.render('admin/type/edit.html', {data: data[0]})
		}
	})
})
// 分类的添加操作
router.post('/add', function (req, res, next) {
	// 接收数据
	let {name, keywords, description, sort} = req.body
	// 将数据插入到数据库
	mysql.query('insert into newstype(name, keywords, description, sort) value(?, ?, ?, ?)', [name, keywords, description, sort], function (err, data) {
		if (err) {
			return ''
		} else {
			// 判断是否执行成功
			if (data.affectedRows == 1) {
				res.send('<script>alert("添加成功"); location.href="/admin/newstype"</script>')
			} else {
				res.send('<script>alert("添加失败"); history.go(-1)</script>')
			}
		}
	})
})
// 无刷新删除数据
router.get('/ajax_del', function (req, res, next) {
	// 接收对应的数据
	let {id} = req.query
	// 修改数据
	mysql.query('delete from newstype where id = ?', [id], function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				res.send('1')
			} else {
				res.send('0')
			}
		}
	})
})
// 修改数据功能实现
router.post('/edit', function (req, res, next) {
	// 接收数据
	let {id, name, keywords, description, sort} = req.body
	sql = `update newstype set name = '${name}', keywords = '${keywords}', description = '${description}', sort = ${sort} where id = ${id}`
	// 执行sql语句
	mysql.query(sql, function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				res.send('<script>alert("修改成功"); location.href="/admin/newstype"</script>')
			} else {
				res.send('<script>alert("修改失败"); history.go(-1)</script>')
			}
		}
	})
})

module.exports = router