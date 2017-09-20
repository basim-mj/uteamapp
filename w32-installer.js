const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
     .then(createWindowsInstaller)
     .catch((error) => {
     console.error(error.message || error)
     process.exit(1)
 })

function getInstallerConfig () {
    console.log('creating windows installer')
    const rootPath = path.join('./')
    const outPath = path.join(rootPath, 'builds')

    return Promise.resolve({
       appDirectory: path.join(outPath, 'uteamapp-win32-ia32'),
       authors: 'Basim Aljohani',
       noMsi: true,
       outputDirectory: path.join(outPath, 'dist'),
       exe: 'uteamapp.exe',
       setupExe: 'UteamappSetup.exe',
       setupIcon: path.join(rootPath, 'icon.ico')
   })
}