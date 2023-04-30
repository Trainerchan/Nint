const { Context } = require('../context/context')
const { http } = require("../tools/tools")

/* 
router模块的话
生成router的时候，同时也生成controller，也就是context
每个router都是有路由路径，和callback参数
1. 有config方法，自定义router
2. 对每一次请求的路由进行处理，然后映射到相应的控制层函数
3。 有options get post put delete patch 方法
控制层单独一个模块
*/
function Router() {
  // 建立map用来存储
  this.requestMap = {
    'GET': {
      '/': function (ctx) {
        ctx.string(`请求路由 "/", 请求成功！`)
      }
    },
    'POST': {},
    'PUT': {},
    'DELETE': {},
  };

  // 此处需要将req与res绑定到this上
  // 并在里面讲req res绑定到函数this上
  // 后期如果有中间件，可能会是统一循环执行一遍后，返回新的req res
  // 最后一步是在map里面找到指定的方法并执行
  // this.aa = http.createServer(function(req, res){
  //   res.writeHead()
  //   res.end()
  // })
  this.server = http.createServer((function (req, res) {
    this.request = req
    this.response = res
    let url = decodeURI(req.url)
    let method = req.method
    let route = url.split('?')[0]
    req.url = url
    req.route = route
    let context = new Context(req, res)
    this.requestMap[method][route](context)
  }).bind(this))
}

// 路由自定义配置
// Router.prototype.routerConfig()

// 路由分组
// Router.prototype.group()

// 使用中间件
// Router.prototype.use()

// get方法，传入路径及回调函数
Router.prototype.get = function (url, handlerFunc) {
  url = decodeURI(url).split('?')[0]
  this.requestMap['GET'][url] = function (ctx) {
    return handlerFunc(ctx)
  }
}

// post方法
Router.prototype.post = function (url, handlerFunc) {
  this.requestMap['POST'][url] = function (ctx) {
    return handlerFunc(ctx)
  }
}

// put方法
// Router.prototype.put()

// delete方法
// Router.prototype.delete()


/*
 *@func: run
 *@description: Router引擎运行的函数
 *@param: {string} hostname
 *@param: {string | number} port
 *@param: {number} backlog
 *@param: {function} callbackListener
 *@return: {null} null
 *@author: 纲总
*/
Router.prototype.run = function (hostname = '127.0.0.1', port = 8080, backlog = 9, callbackListener = null) {
  console.time('\u001b[32m[NINT debug] 服务启动耗时\u001b[0m')
  console.log('------------------------------------------------------------------')
  console.log('\u001b[33m%s\u001b[0m', '[NINT-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.\n')
  this.server.listen({
    port: port,
    hostname: hostname,
    backlog: backlog,
    listeningListener: callbackListener
  })

  Object.entries(this.requestMap).filter(([_, v]) => Object.keys(v).length > 0).forEach(([k, v]) => {
    Object.keys(v).forEach(url => {
      console.log(`\u001b[32m%s\u001b[0m`, `[NINT-debug] ${k} ------ ${url}\n`)
    })
  })

  console.log('\u001b[33m%s\u001b[0m', '[NINT-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.\n')
  console.log('\u001b[32m%s\u001b[0m', `[NINT-debug] Listening and serving HTTP on ${hostname}:${port}\n`)

  console.timeEnd('\u001b[32m[NINT debug] 服务启动耗时\u001b[0m')
  console.log('------------------------------------------------------------------')
}

var router = new Router()

module.exports = router
