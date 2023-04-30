const nint = require('./index')

let router = nint.default()

// get方法测试
router.get('/login', function (ctx) {
  let param = ctx.query()
  ctx.json(200, param)
})

// post方法测试
// 请求体中要附带username字段
// 请求头Content_type为x-www-urlencoded
router.post('/login', async function (ctx) {
  let username = await ctx.postForm('username')
  ctx.json(200, {
    'message': 'OK',
    "username": username
  })
})

router.run()