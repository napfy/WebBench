const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function runCmd (cmd) {
  const { stdout, stderr } = await exec(cmd)
  if (stdout != null) {
    return { code: 0, log: stdout }
  }
  if (stderr != null) {
    return { code: 1, log: stderr }
  }
  return { code: 2, log: '系统或网络出错' }
}

exports.runCmd = runCmd
