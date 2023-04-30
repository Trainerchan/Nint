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
  const self = this
  this.requestMap = {
    'get': [],
    'post': [],
    'put': [],
    'delete': [],
  };
  // 此处需要将req与res绑定到this上
  this.server = http.createServer((function (req, res) {
    this.request = req
    this.response = res
    console.log(req.url)
    console.log('请求成功')
    res.setHeader('Content-Type', 'text/plain;charset=utf8')
    res.end('测试')
  }).bind(this))
}

// Router.prototype.routerConfig()
// Router.prototype.group()
// Router.prototype.use()
// Router.prototype.get = function (url, handlerFunc) { 
//   this.requestMap['get'] = 
//  }
// Router.prototype.post()
// Router.prototype.put()
// Router.prototype.delete()
Router.prototype.run = function (hostname = '127.0.0.1', port = 8080, backlog = 9, callbackListener = null) {
  // console.log('请求url:', this.request.url)
  console.time('\u001b[32m服务启动耗时\u001b[0m')
  console.log('------------------------------------------------------------------')
  console.log('\u001b[33m%s\u001b[0m', '[JIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.\n')
  this.server.listen({
    port: port,
    hostname: hostname,
    backlog: backlog,
    listeningListener: callbackListener
  })

  console.log('\u001b[33m%s\u001b[0m', '[JIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.\n')
  console.log('\u001b[32m%s\u001b[0m', `[JIN-debug] Listening and serving HTTP on ${hostname}:${port}\n`)

  console.timeEnd('\u001b[32m服务启动耗时\u001b[0m')
  console.log('------------------------------------------------------------------')
}

routerTest = new Router()

module.exports = routerTest
