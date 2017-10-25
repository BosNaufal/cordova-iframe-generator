
import { exec } from 'child_process'
import path from 'path'
import { ROOT_DIR, CORDOVA_BIN, CORDOVA_APPS_DIR } from '../global.js'

module.exports = function (req, res) {
  const { appName } = req.params
  const projectPath = path.join(CORDOVA_APPS_DIR, appName)
  const command = `${CORDOVA_BIN} compile android`
  console.log(command);
  exec(command, { cwd: projectPath }, (err, stdout, stderr) => {
    console.log(err, stdout);
    res.json("Done")
  })
}
