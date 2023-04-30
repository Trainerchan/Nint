const { context, router } = require("./packages")
/*
Nint
主要包含一个
初始化engine
*/
function Nint() {
  this.context = context
}

/*
 *@func: default
 *@description: 默认的路由，默认的域名以及端口号，使用默认的中间件
 *@param: {null} null
 *@return: {Nint.Engine} Nint.Engine 全局路由引擎
 *@author: 纲总
*/
Nint.prototype.default = function () {
  return router
}

var nint = new Nint()

module.exports = nint

// 输出的日志格式
/*
[GIN] 2023/04/30 - 10:15:53 |[90;43m 404 [0m|            0s |       127.0.0.1 |[97;44m GET     [0m "/"

[GIN] 2023/04/30 - 10:15:59 |[97;42m 200 [0m|       303.9µs |       127.0.0.1 |[97;44m GET     [0m "/test"
*/