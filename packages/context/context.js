/*
Controller
1. 生成一个唯一的控制中心 context，需要传入参数req, res,由路由模块处理后传入
2.
*/

const { querystring } = require("../tools/tools")

function Context(request, response) {
  this.request = request
  this.response = response
}

/*-------------------------------------------------------------------------------------------------------
 *---------------------------------------------基本的钩子------------------------------------------------
 *-------------------------------------------------------------------------------------------------------
*/

/*
 *@func: request
 *@description:返回统一的请求钩子
 *@param: {null} null
 *@return: {Object} rrequest Object
 *@author: 纲总
*/
Context.prototype.request = (function () {
  return this.request
}())

/*
 *@func: response
 *@description: 返回统一的响应钩子
 *@param: {null} null
 *@return: {Object} response Object
 *@author: 纲总
*/
Context.prototype.response = (function () {
  return this.response
}())

/*
 *@func: logger
 *@description: 统一log打印方法
 *@param: {number} statusCode
 *@return: {null} void
 *@author: 纲总
*/
Context.prototype.logger = function (statusCode = 200) {
  const logMap = {
    '10': '\u001b[34m[NINT debug] %s     |     %s     |     %s     |\u001b[0m',
    '20': '\u001b[32m[NINT debug] %s     |     %s     |     %s     |\u001b[0m',
    '30': '\u001b[33m[NINT debug] %s     |     %s     |     %s     |\u001b[0m',
    '40': '\u001b[31m[NINT debug] %s     |     %s     |     %s     |\u001b[0m',
    '50': '\u001b[35m[NINT debug] %s     |     %s     |     %s     |\u001b[0m',
  }
  let state = JSON.stringify(statusCode).slice(0, 2)
  let method = this.request.method
  let route = this.request.route
  console.log(logMap[state], route, method, statusCode)
}

/*-------------------------------------------------------------------------------------------------------
 *-----------------------------------------------请求方法------------------------------------------------
 *-------------------------------------------------------------------------------------------------------
*/

/*
 *@func: query
 *@description: 返回路由上的参数param
 *@param: {string | null} key
 *@return: {string | Object} 单个值字符串或者Object对象
 *@author: 纲总
*/
Context.prototype.query = function (key = null) {
  let params = Object.fromEntries(this.request.url.split('?')[1].split('&').map(v => v.split('=')))
  return (key && params[key]) || params
}

Context.prototype.postForm = function (key = null) {
  if (key === null) {
    throw new Error('key is not empty')
  }
  let val = null
  return new Promise((resolve, reject) => {
    this.request.on('data', function (chunk) {
      val = querystring.parse(chunk.toString('utf8'))[key]
    }).on('end', function () {
      resolve(val)
    }).on('error', function (err) {
      reject(err)
    })
  })

}

/*-------------------------------------------------------------------------------------------------------
 *-----------------------------------------------响应方法------------------------------------------------
 *-------------------------------------------------------------------------------------------------------
*/

/*
 *@func: direct
 *@description: 重定向
 *@param: {number} statusCode
 *@param: {string} 重定向路由
 *@return: {null} void
 *@author: 纲总
*/
Context.prototype.direct = function (statusCode = 200, route = '/') {
  const headers = this.request.headers
  let hostname = headers['host']
  let port = headers['x-forwarded-port'] || headers['x-real-port'] || request.socket.remotePort
  this.response.writeHead(statusCode, {
    'Location': `http://${hostname}:${port}${route}`
  })
  this.response.end()
  this.logger(this.response.statusCode)
}

/*
 *@func: html
 *@description: 响应html
 *@param: {number} statusCode
 *@param: {string} htmlString
 *@return: {null} void
 *@author: 纲总
*/
Context.prototype.html = function (statusCode = 200, htmlString = '') {
  this.response.writeHead(statusCode, {
    'Content-Type': 'text/html;charset=utf8'
  })
  this.response.write(htmlString)
  this.response.end()
  this.logger(this.response.statusCode)
}

/*
 *@func: string
 *@description: 返回字符串响应
 *@param: {number} statusCode
 *@param: {string} message
 *@return: {null} void
 *@author: 纲总
*/
Context.prototype.string = function (statusCode = 200, responseStr = '') {
  this.response.writeHead(statusCode, {
    'Content-Type': 'text/plain;charset=utf8'
  })
  this.response.write(responseStr)
  this.response.end()
  this.logger(this.response.statusCode)
}

/*
 *@func: json
 *@description: 返回JSON响应
 *@param: {number} statusCode
 *@param: {Object} jsonData
 *@return: {null} void
 *@author: 纲总
*/
Context.prototype.json = function (statusCode = 200, data = {}) {
  this.response.setHeader('Content-Type', 'application/json;charset=utf8')
  data['statusCode'] = statusCode
  this.response.write(JSON.stringify(data))
  this.response.end()
  this.logger(this.response.statusCode)
}

/*
 *@func: protoBuff
 *@description: 响应二进制数据流
 *@param: {number} statusCode
 *@param: {binary} data
 *@return: {null | error} void
 *@author: 纲总
*/
Context.prototype.protoBuff = function (statusCode = 200, data) {
  if (data === undefined) {
    throw new Error('protoBuff --> data is undefined')
  }
  this.response.writeHead(statusCode, {
    'Content-Type': 'application/octet-stream'
  })
  this.response.write(data, 'binary')
  this.response.end()
  this.logger(this.response.statusCode)
}

var context = new Context()

module.exports = {
  context,
  Context
}