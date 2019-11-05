const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
// const route = require('koa-router')

const config = require('../nuxt.config.ts')
const api = require('./api')

const app = new Koa()

// const rt = route()

// Import and Set Nuxt.js options

config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3010
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // api.init(app, rt, koabody)

  //  app.use(rt.routes())
  app.use(api())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
