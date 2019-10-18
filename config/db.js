// 导入数据库模块
const mysql = require('mysql')
// 设置数据库连接属性
let connect = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'zhang20100549',
	database: 'blog'
})
//开始连接数据库
connect.connect()

module.exports = connect