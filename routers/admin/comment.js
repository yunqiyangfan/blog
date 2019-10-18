// 导入express框架
let express = require('express')
// 实例化路由类
let router = express.Router()

const mysql = require('../../config/db.js')

const moment = require('moment')

// 导入分页函数
const pages = require('../../common/pages.js')

router.get('/', function (req, res, next) {
	// 分页页码
	let page = req.query.page ? req.query.page : 1
	let size = 5
	mysql.query('select count(*) total from comment', function (err, data) {
		if (err) {
			return ''
		} else {
			// 搜索关键词
			let search = req.query.search ? req.query.search : ''
			let pageFunc = pages(data[0].total, page, size, search)
			// 从数据库中查询数据
			mysql.query('select comment.*, user.username, news.title, news.img from comment, user, news where comment.user_id = user.id and comment.news_id = news.id and user.username like ? order by comment.id desc limit ?, ?', [`%${search}%`, pageFunc.start, pageFunc.size], function (err, data) {
				// 判断是否执行成功
				if (err) {
					return ''
				} else {
					data.forEach(item => {
						item.time = moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')
					})
					res.render('admin/comment/index.html', {data: data, search: search, show: pageFunc.show})
				}
			})
		}
	})
})
// 无刷新修改状态
router.get('/ajax_status', function (req, res, next) {
	// 接收对应的数据
	let {id, status} = req.query
	// 修改数据
	mysql.query('update comment set status = ? where id = ?', [status, id], function (err, data) {
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
module.exports = router