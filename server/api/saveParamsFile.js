const fsPromises = require('fs').promises
const Router = require('koa-router')
const koabody = require('koa-body')

const saveRouter = new Router()

saveRouter.post('/api/saveparams', koabody(),
  async (ctx) => {
    const resp = { log: [], code: 0, err: [], time: 0 }
    const b = ctx.request.body.paramsbody
    if (!b) {
      resp.code = -2
      ctx.body = JSON.stringify(resp)
      return
    }
    await fsPromises.writeFile('datafile', b, (err) => {
      if (err) {
        resp.code = -1
        resp.err.push('file save err:' + err)
      } else {
        resp.log.push('params data file saved')
      }
      ctx.body = JSON.stringify(resp)
    })
  }
)

module.exports = saveRouter
