const combrouters = require('./combrouters')
const groupRouter = require('./api/runGroup')
const saveRouter = require('./api/saveParamsFile')

const api = combrouters(
  groupRouter,
  saveRouter
)

module.exports = api
