const {ipcRenderer} = require('electron')

let firebaseConfig

ipcRenderer.on('menu.home' , () =>{
    window.location.href = 'home.html'
})

ipcRenderer.on('menu.team.new' , () =>{
    window.location.href = 'new-team.html'
})

ipcRenderer.on('menu.team.list' , () =>{
    window.location.href = 'my-teams.html'
})
