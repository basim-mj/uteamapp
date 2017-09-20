const electron = require('electron')
require('./core/app-events')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu


let mainWindow

let firebaseConfig
let teamData
let userData


const path = require('path')
const url = require('url')

const menuTemplate = [
  {
    label: 'app',
    submenu: [
      {
        label: 'Home',
        accelerator: 'CommandOrControl+H',
        click() {
          mainWindow.webContents.send('menu.home')
        }
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click() {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Teams',
    submenu: [
      {
        label: 'New Team',
        accelerator: 'CommandOrControl+N',
        click() {
          mainWindow.webContents.send('menu.team.new')
        }
      },
      {
        label: 'My Teams',
        accelerator: 'CommandOrControl+L',
        click() {
          mainWindow.webContents.send('menu.team.list')
        }
      }
    ]
  }
]

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    width: 1280,
    show: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/home.html'),
    protocol: 'file:',
    slashes: true
  }))

  //mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })
  const appMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(appMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


function setFirebaseConfig(data) {
  firebaseConfig = data
}

function getFirebaseConfig(){
  return firebaseConfig
}

function setTeamData(data){
  teamData = data
}

function getTeamData(){
  return teamData
}

function setUserData(data){
  userData = data
}

function getUserData(){
  return userData
}

module.exports = {
  getFirebaseConfig,
  setFirebaseConfig,
  getTeamData,
  setTeamData,
  getUserData,
  setUserData
}
