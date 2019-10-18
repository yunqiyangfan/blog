// 导入express框架
let express = require('express')
// 实例化路由类
let router = express.Router()

const mysql = require('../../config/db.js')

const crypto = require('crypto')

const moment = require('moment')

router.get('/', function (req, res, next) {
	let search = req.query.search ? req.query.search : ''
	// 从数据库中查询数据
	mysql.query('select * from admin where username like ? order by id desc', [`%${search}%`], function (err, data) {
		// 判断是否执行成功
		if (err) {
			return ''
		} else {
			data.forEach(item => {
				item.time = moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')
			})
			res.render('admin/admin/index.html', {data: data, search: search})
		}
	})
})
// 添加管理员页面
router.get('/add', function (req, res, next) {
	res.render('admin/admin/add.html')
})
// 管理员的添加功能
router.post('/add', function (req, res, next) {
	// 接收数据
	let {username, password, repassword, status} = req.body
	// 判断用户名是否书写
	if (username) {
		// 判断用户名长度
		if (username.length <= 12) {
			// 判断密码
			if (password) {
				// 判断两次密码是否一致
				if (password == repassword) {
					// 判断该用户名是否已经注册
					mysql.query('select * from admin where username = ?', [username], function (err, data) {
						if (err) {
							return ''
						} else {
							if (data.length == 0) {
								// 没有注册，我们需要插入数据
								// 当前时间戳
								let time = Math.round((new Date().getTime()) / 1000)
								// 密码加密
								let md5 = crypto.createHash('md5')
								password = md5.update(password).digest('hex')
								mysql.query('insert into admin(username, password, status, time) value(?, ?, ?, ?)', [username, password, status, time], function (err, data) {
									if (err) {
										return ''
									} else {
										// 判断是否执行成果
										if (data.affectedRows == 1) {
											res.send('<script>alert("添加成功"); location.href="/admin/admin"</script>')
										} else {
											res.send('<script>alert("添加失败"); history.go(-1)</script>')
										}
									}
								})
							} else {
								res.send('<script>alert("该账户名已经注册，请重新输入"); history.go(-1)</script>')
							}
						}
					})
				} else {
					res.send('<script>alert("两次密码不一致"); history.go(-1)</script>')
				}
			} else {
				res.send('<script>alert("请输入密码"); history.go(-1)</script>')
			}
		} else {
			res.send('<script>alert("用户名长度应当在6至12个字符之间"); history.go(-1)</script>')
		}
	} else {
		res.send('<script>alert("请输入账户名"); history.go(-1)</script>')
	}
})
// 无刷新修改状态
router.get('/ajax_status', function (req, res, next) {
	// 接收对应的数据
	let {id, status} = req.query
	// 修改数据
	mysql.query('update admin set status = ? where id = ?', [status, id], function (err, data) {
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
// 无刷新删除数据
router.get('/ajax_del', function (req, res, next) {
	// 接收对应的数据
	let {id} = req.query
	// 修改数据
	mysql.query('delete from admin where id = ?', [id], function (err, data) {
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
// 修改页面
router.get('/edit', function (req, res, next) {
	// 接收对应的数据
	let {id} = req.query
	// 查询数据
	mysql.query('select * from admin where id = ?', [id], function (err, data) {
		if (err) {
			return ''
		} else {
			res.render('admin/admin/edit.html', {data: data[0]})
		}
	})
})
// 修改数据功能实现
router.post('/edit', function (req, res, next) {
	// 接收数据
	let {username, password, repassword, status, id} = req.body
	// 判断用户是否修改了密码
	if (password) {
		let md5 = crypto.createHash('md5')
		password = md5.update(password).digest('hex')
		sql = `update admin set status = ${status}, password = '${password}' where id = ${id}`
	} else {
		sql = `update admin set status = ${status} where id = ${id}`
	}
	// 执行sql语句
	mysql.query(sql, function (err, data) {
		if (err) {
			return ''
		} else {
			if (data.affectedRows == 1) {
				res.send('<script>alert("修改成功"); location.href="/admin/admin"</script>')
			} else {
				res.send('<script>alert("修改失败"); history.go(-1)</script>')
			}
		}
	})
})

module.exports = router