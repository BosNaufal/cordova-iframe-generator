
import { exec } from 'child_process'
import path from 'path'

export const ROOT_DIR = path.join(__dirname);
export const CORDOVA_BIN = path.join(ROOT_DIR, "node_modules", "cordova", "bin", "cordova")
export const CORDOVA_APPS_DIR = path.join(__dirname, "../", "cordovas");
export const TEMPLATE_PATH = path.join(__dirname, "templates");

export const SDK_PATH = "/home/naufal/Android/Sdk"
export const JAVA_PATH = "/usr/lib/jvm/java-8-oracle"
export const GRADLE_PATH = "/home/naufal/.sdkman/candidates/gradle/current"

export function settingPath(callback) {
  const exportAndroidPath = `export ANDROID_HOME=${SDK_PATH}`

  const exportJavaPath = `export JAVA_HOME=${JAVA_PATH}`

  const exportGradlePath = `export GRADLE_HOME=${GRADLE_PATH}`
  const exportGradleBin = `export PATH="$PATH:$GRADLE_HOME/bin"`

  const command = `${exportAndroidPath} && ${exportJavaPath} && ${exportGradlePath} && ${exportGradleBin}`
  exec(command, {}, (err, stdout, stderr) => {
    console.log(err, stdout, stderr);
    callback(err, stdout, stderr)
  })
}
