
import { exec } from 'child_process'
import path from 'path'
import { CORDOVA_APPS_DIR } from '../global.js'

module.exports = function (req, res) {
  const { appName } = req.params
  const projectPath = path.join(CORDOVA_APPS_DIR, appName)
  const APKDir = path.join(CORDOVA_APPS_DIR, appName, "platforms/android/build/outputs/apk/")
  const APKPath = path.join(APKDir, appName + ".apk")
  res.download(APKPath)
}
