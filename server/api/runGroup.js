const Router = require('koa-router')
const koabody = require('koa-body')
const proc = require('../process')
const groupRouter = new Router()

groupRouter.post('/api/rungroup', koabody(),
  async (ctx) => {
    const b = ctx.request.body
    const resp = { log: [], code: 0, err: [], time: 0 }
    if (b.precmd !== '') {
      const rslt = await proc.runCmd(b.precmd)
      if (rslt.code === 0) {
        // 提示完成
        resp.log.push(rslt.log)
      } else {
        // 出错直接退出
        resp.err.push(rslt.log)
        resp.code = -1
      }
    }

    if (b.useab === 1) {
      const time0 = Date.now()
      const rslt = await proc.runCmd(b.cmd)
      if (rslt.code === 0) {
        // 解析返回输出
        resp.time = Date.now() - time0
        resp.log.push(rslt.log)
      } else {
        // 提示出错
        resp.err.push(rslt.log)
        resp.code = 1
      }
    } else {
      const time0 = Date.now()
      const rslt = await proc.runCmd(b.cmd)
      if (rslt.code === 0) {
        // 输出 正确信息
        resp.log.push(rslt.log)
        resp.time = Date.now() - time0
      } else {
        // 输出错误信息
        resp.err.push(rslt.log)
        resp.code = 1
      }
    }

    if (b.fincmd !== '') {
      const rslt = await proc.runCmd(b.fincmd)
      if (rslt.code === 0) {
        // 提示完成
        resp.log.push(rslt.log)
      } else {
        // 出错提示
        resp.err.push(rslt.log)
        resp.code = 2
      }
    }
    ctx.body = JSON.stringify(resp)
  }
)

module.exports = groupRouter
