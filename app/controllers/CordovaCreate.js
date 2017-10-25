
import { exec, execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
const Babel = require("babel-standalone")

import utils from '../utils.js'

import { ROOT_DIR, CORDOVA_APPS_DIR, TEMPLATE_PATH, CORDOVA_BIN } from '../global.js'


function compileAPK(payload, callback) {
 const projectPath = path.join(CORDOVA_APPS_DIR, payload.appName)
 const command = `${CORDOVA_BIN} compile android`

 console.log(command);
 exec(command, { cwd: projectPath }, (err, stdout, stderr) => {
   console.log(err, stdout, stderr);
   callback(err, stdout, stderr)
 })
}

function renameAPK(payload) {
  const APKDir = path.join(CORDOVA_APPS_DIR, payload.appName, "platforms/android/build/outputs/apk/")
  const oldAPK = path.join(APKDir, "android-debug.apk")
  const newAPK = path.join(APKDir, payload.appName + ".apk")
  execSync(`mv ${oldAPK} ${newAPK}`)
  return newAPK
}

function installPlugins(payload, callback) {
 const projectPath = path.join(CORDOVA_APPS_DIR, payload.appName)
 const command = `${CORDOVA_BIN} prepare android`

 console.log(command);
 exec(command, { cwd: projectPath }, (err, stdout, stderr) => {
   console.log(err, stdout, stderr);

   /*
     // When config.xml fail
     const JSONfilePath = path.join(projectPath, "package.json")
     const packageJSONContent = fs.readFileSync(JSONfilePath)
     const jsonData = JSON.parse(packageJSONContent)
     console.log(jsonData);
   */


   callback(err, stdout, stderr)
 })
}

function moveIcon(payload, files) {
  const file = files[0]
  const newProjectPath = path.join(CORDOVA_APPS_DIR, payload.appName)
  execSync(`mv ${file.path} ${newProjectPath}/www/icon.png`)
}

function writeFile(location, content) {
  console.log("writing file: " + location);
  if (fs.existsSync(location)) execSync(`rm -R ${location}`)
  fs.writeFileSync(location, content)
}

function getTemplate(location) {
  return path.join(TEMPLATE_PATH, location)
}

function remakeFile(payload) {
  const { appName } = payload
  const projectPath = path.join(CORDOVA_APPS_DIR, appName)

  const XMLfilePath = `${projectPath}/config.xml`
  const XMLContent = utils.renderStringTemplate(getTemplate("config-xml.hbs"), payload)
  writeFile(XMLfilePath, XMLContent)

  const JSfilePath = `${projectPath}/www/js/index.js`
  let JSContent = utils.renderStringTemplate(getTemplate("www-index-js.hbs"), payload)
  JSContent = Babel.transform(JSContent, { presets: ['es2015', 'stage-2'] }).code
  writeFile(JSfilePath, JSContent)

  const HTMLfilePath = `${projectPath}/www/index.html`
  const HTMLContent = utils.renderStringTemplate(getTemplate("www-index-html.hbs"), payload)
  writeFile(HTMLfilePath, HTMLContent)

  const JSONfilePath = `${projectPath}/package.json`
  const { plugins } = payload
  payload.plugins = plugins.split(",").map((plugin) => `"${plugin}": {}` ).join(`,\n      `)
  const JSONContent = utils.renderStringTemplate(getTemplate("package-json.hbs"), payload)
  writeFile(JSONfilePath, JSONContent)
}

function createProjectDir(payload, callback) {
  const { packageName, appName } = payload
  const baseProjectPath = path.join(CORDOVA_APPS_DIR, "base")
  const newProjectPath = path.join(CORDOVA_APPS_DIR, appName)
  const existed = fs.existsSync(newProjectPath);
  if (existed) {
    console.log("remove existing project...");
    execSync(`rm -R ${newProjectPath}`)
  }
  console.log("copying base project...");
  exec(`cp -R ${baseProjectPath} ${newProjectPath}`, {}, (err, stdout, stderr) => {
    console.log("done copy project...");
    callback(err, stdout, stderr)
  })
}

module.exports = function (req, res) {
  createProjectDir(req.body, (err, stdout, stderr) => {
    if (err) {
      return res.json({
        success: false,
        message: "Something goes wrong",
        log: err,
      })
    }
    moveIcon(req.body, req.files)
    remakeFile(req.body)
    installPlugins(req.body, (err, stdout, stderr) => {
      // if (err) {
      //   return res.json({
      //     success: false,
      //     message: "Something goes wrong",
      //     log: err,
      //     stderr: stderr,
      //   })
      // }
      compileAPK(req.body, (err, stdout, stderr) => {
        if (err) {
          return res.json({
            success: false,
            message: "Something goes wrong",
            log: err,
            stderr: stderr,
          })
        }

        renameAPK(req.body)

        const { appName } = req.body
        const projectPath = path.join(CORDOVA_APPS_DIR, appName)
        const APKDir = path.join(CORDOVA_APPS_DIR, appName, "platforms/android/build/outputs/apk/")
        const APKPath = path.join(APKDir, appName + ".apk")
        res.download(APKPath)
        // res.redirect(`${req.get("host")}/download/${req.body.appName}`)
        // res.json({
        //   success: true,
        //   message: "App Has Been Created",
        //   link: `${req.get("host")}/download/${req.body.appName}`
        // })
        console.log("done...");
      })
    })
  })
}
