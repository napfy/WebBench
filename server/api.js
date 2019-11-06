const combrouters = require('./combrouters')
const groupRouter = require('./api/runGroup')
const saveRouter = require('./api/saveParamsFile')

const api = combrouters(
  saveRouter,
  groupRouter
)

module.exports = api
