import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

function findAndroidSdk() {
  const candidates = [
    process.env.ANDROID_SDK_ROOT,
    process.env.ANDROID_HOME,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : null,
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Android', 'Sdk') : null,
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  return null
}

function hasAdb(sdkRoot) {
  const adbPath = path.join(sdkRoot, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb')
  return fs.existsSync(adbPath)
}

const sdkRoot = findAndroidSdk()

if (!sdkRoot) {
  console.error('Mobile test preflight failed: Android SDK not found.')
  console.error('Set ANDROID_HOME or ANDROID_SDK_ROOT, then retry npm run test:mobile.')
  process.exit(1)
}

if (!hasAdb(sdkRoot)) {
  console.error(`Mobile test preflight failed: adb not found under ${sdkRoot}.`)
  console.error('Install Android SDK Platform-Tools in Android Studio SDK Manager, then retry.')
  process.exit(1)
}

const env = {
  ...process.env,
  ANDROID_HOME: process.env.ANDROID_HOME || sdkRoot,
  ANDROID_SDK_ROOT: process.env.ANDROID_SDK_ROOT || sdkRoot,
}

console.log(`Using Android SDK: ${sdkRoot}`)

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

async function waitForAppiumStatus(timeoutMs = 30000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch('http://127.0.0.1:4723/status')
      if (response.ok) {
        return true
      }
    } catch {
      // server not ready yet
    }

    await delay(1000)
  }

  return false
}

const appiumProcess = spawn(npxCommand, ['appium', '--base-path', '/', '--port', '4723'], {
  stdio: 'pipe',
  shell: false,
  env,
})

appiumProcess.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
})

appiumProcess.stderr.on('data', (chunk) => {
  process.stderr.write(chunk)
})

let cleanedUp = false

function cleanupAppium() {
  if (cleanedUp) {
    return
  }

  cleanedUp = true
  if (!appiumProcess.killed) {
    appiumProcess.kill('SIGTERM')
  }
}

process.on('SIGINT', () => {
  cleanupAppium()
  process.exit(130)
})

process.on('SIGTERM', () => {
  cleanupAppium()
  process.exit(143)
})

const appiumReady = await waitForAppiumStatus()

if (!appiumReady) {
  cleanupAppium()
  console.error('Mobile test preflight failed: Appium server did not become ready on http://127.0.0.1:4723.')
  process.exit(1)
}

const wdioProcess = spawn(npxCommand, ['wdio', 'run', './wdio.mobile.conf.cjs'], {
  stdio: 'inherit',
  shell: false,
  env,
})

wdioProcess.on('exit', (code) => {
  cleanupAppium()
  process.exit(code ?? 1)
})
