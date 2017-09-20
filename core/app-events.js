const ipcMain = require('electron').ipcMain
const { AppDB, TeamPassport } = require('./app-lib')
const download = require('download-file')
const https = require('https')


const teamPassport = new TeamPassport()

ipcMain.on('team.passport.enc', (event, data) => {
  const text = teamPassport.encrypte(data.text, data.password)
  event.sender.send('team.passport.enc', text)
})
ipcMain.on('team.passport.dec', (event, data) => {
  const text = teamPassport.decrypte(data.text, data.password)
  event.sender.send('team.passport.dec', text)
})

ipcMain.on('db.teams.add', (event, data) => {
  const db = new AppDB("teams")
  db.add(data)

  const obj = db.getAll()
  event.sender.send('db.teams.getall', obj)
})

ipcMain.on('db.teams.getall', (event, data) => {
  const db = new AppDB("teams")
  const obj = db.getAll()
  event.sender.send('db.teams.getall', obj)
})

ipcMain.on('db.teams.delete', (event, data) => {
  const db = new AppDB("teams")
  db.delete(data.id)
  const obj = db.getAll()
  event.sender.send('db.teams.getall', obj)
})

ipcMain.on('db.user.set', (event, data) => {
  const db = new AppDB("user")
  db.setData(data)
  const obj = db.getAll()
  event.sender.send('db.user.get', obj)
})

ipcMain.on('db.user.get', (event, data) => {
  const db = new AppDB("user")
  const obj = db.getAll()
  event.sender.send('db.user.get', obj)
})

ipcMain.on('db.projects.get', (event, data) => {
  const db = new AppDB("projects")
  const obj = db.getByID(data)
  event.sender.send('db.projects.get', obj)
})

ipcMain.on('db.projects.add', (event, data) => {
  const db = new AppDB("projects")
  db.addByID(data)

  const obj = db.getByID(data.id)
  event.sender.send('db.projects.get', obj)
})

ipcMain.on('db.projects.update', (event, data) => {
  const db = new AppDB("projects")
  db.setDataByID(data.data, data.id)
})

ipcMain.on('app.files.down', (event, data) => {

  if (data.dist == '') {
    return
  }

  const options = {
    directory: data.dist,
    filename: data.name
  }

  console.log('donwloading')

  download(data.url, options, err => {
    if (err) {
      console.log(err)
      event.sender.send('app.files.download.status',{success:false,index:data.index})
    } else {
      console.log('done')
      event.sender.send('app.files.download.status',{success:true,index:data.index})
    }
  })
})