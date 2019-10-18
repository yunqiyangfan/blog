// 导入express框架
let express = require('express')
// 初始化express
let app = express()
// 处理post请求
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
// 处理session
const session = require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
// 设置模板引擎相关信息
let ejs = require('ejs')
let path = require('path')
// 设置模板存放目录，第一个参数固定，第二个参数是模板存放的目录
app.set('views', './views')
// 定义使用的模板引擎，第一个参数为模板引擎的名称，第二个参数为使用模板引擎的方法
app.engine('html', ejs.__express)
// 在app中注册模板引擎，第一个参数固定，第二个参数与定义的模板引擎的名称有关
app.set('view engine', 'html')
// 设置静态资源的访问
app.use('/public', express.static(__dirname + '/public'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use('/images', express.static(__dirname + '/images'))
// 导入前台的路由文件
let indexRouter = require('./routers/index')
// 导入后台的路由文件
let adminRouter = require('./routers/admin')
// 使用前台路由，第一个参数为匹配路由规则，参数二为请求路由规则
app.use('/', indexRouter)
app.use('/admin', adminRouter)

let ueditor = require('ueditor')
//使用模块
app.use("/public/baidu/ueditors", ueditor(path.join(__dirname, ''), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
 
        var imgname = req.ueditor.filename;
 
        var img_url = '/images/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/public/baidu/php/config.json');
    }
}))
// 监听服务器
app.listen(3000, function () {
	console.log('node服务已启动')
})