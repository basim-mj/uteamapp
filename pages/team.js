const Vue = require('./vue')
const { ipcRenderer } = require('electron')
const { getFirebaseConfig, getTeamData, getUserData } = require('electron').remote.require('./main.js')

require('./app')

const firebase = require('firebase')
require('firebase/storage')

const app = firebase.initializeApp(getFirebaseConfig())
const storage = app.storage()
const db = app.database()

let chatRef
let filesRef

new Vue({
    el: '#app',
    data: {
        team: {},
        chats: [],
        logedin: false,
        message: '',
        mode: 0,
        useStorage: false,
        filesFolder: '',
        auth: false,
        authResult: '',
        allowSignup: false,
        teamName: '',
        userEmail: '',
        userPassword: '',
        files: [],
        storageFileList: '',
        user: {},
        uploadLogs: [],
        authAction:true
    },
    methods: {
        signup() {
            this.authAction = false
            firebase.auth().createUserWithEmailAndPassword(this.userEmail, this.userPassword)
                .then(() => {
                    this.authResult = 'signup succeed'
                })
                .catch(error => {
                    this.authResult = error.message
                    this.authAction = true
                })
        },
        login() {
            this.authAction = false
            firebase.auth().signInWithEmailAndPassword(this.userEmail, this.userPassword)
                .then(() => {
                    this.auth = true
                    chatRef = db.ref('chat')
                    filesRef = db.ref('files')

                    chatRef.on('value', snapshot => {
                        const chats = snapshot.val()
                        this.chats = []
                        for (let v in chats) {
                            this.chats.unshift({
                                message: chats[v].message,
                                displayName: chats[v].displayName,
                                avatar: chats[v].avatar
                            })
                        }
                    })

                    filesRef.on('value', snapshot => {
                        const files = snapshot.val()
                        this.files = []
                        for (let f in files) {
                            this.files.unshift({
                                name: files[f].name,
                                url: files[f].url,
                                downloading: false,
                                class: 'is-info'
                            })
                        }
                    })
                })
                .catch(error => {
                    this.authResult = error.message
                    this.authAction = true
                })
        },
        send() {
            chatRef.push({
                message: this.message,
                displayName: this.displayName,
                avatar: this.avatar
            })
            console.log('sent')
            this.message = ''
        },
        fileDir(event) {
            console.log(event.target.files[0].path)
            this.filesFolder = event.target.files[0].path
            this.saveProjectData()
        },
        saveProjectData() {
            ipcRenderer.send('db.projects.update', {
                data: {
                    id: this.team.id,
                    filesFolder: this.filesFolder,
                    backupFolder: this.backupFolder
                },
                id: this.team.id
            })
        },
        upload(e) {

            for (let i = 0; i < e.target.files.length; i++) {

                let file = e.target.files[i]
                let storageRef = storage.ref().child('file')
                let fileRef = storageRef.child(file.name)
                let task = fileRef.put(file)

                this.uploadLogs.push({
                    progress: 0,
                    name: file.name,
                    class: 'is-info'
                })

                const logIndex = this.uploadLogs.length - 1

                task.on('state_changed', data => {
                    this.uploadLogs[logIndex].progress = (data.bytesTransferred / data.totalBytes) * 100
                }, error => {
                    this.uploadLogs[logIndex].class = 'is-danger'
                }, success => {
                    this.uploadLogs[logIndex].class = 'is-success'
                    const fileUrl = task.snapshot.downloadURL
                    filesRef.push({
                        by: this.displayName,
                        url: fileUrl,
                        name: file.name
                    }, success => {
                        console.log('uploaded')
                    })
                })
            }


        },
        download(file, index) {
            ipcRenderer.send('app.files.down', {
                url: file.url,
                dist: this.filesFolder,
                name: file.name,
                index
            })

            this.files[index].downloading = true
        },
        clearUploadLogs() {
            this.uploadLogs = []
        }
    },
    computed: {
        displayName() {
            return this.user.displayName
        },
        avatar() {
            return this.user.avatar
        }
    },
    created() {

        this.team = getTeamData()

        console.log(this.team)

        this.useStorage = this.team.useStorage
        this.allowSignup = this.team.allowSignup
        this.storageFileList = this.team.storageFileList

        this.user = getUserData()
        this.userEmail = this.user.defaultEmail

        document.title = 'UTeam App - ' + this.team.name

        ipcRenderer.send('db.projects.get', this.team.id)

        ipcRenderer.on('db.projects.get', (event, data) => {
            if (data == null) {
                ipcRenderer.send('db.projects.add', {
                    id: this.team.id,
                    filesFolder: ''
                })
            } else {
                this.filesFolder = data.filesFolder
            }
        })

        ipcRenderer.on('app.files.download.status', (event, data) => {
            if (data.success) {
                this.files[data.index].downloading = false
                this.files[data.index].class = 'is-success'
            } else {
                this.files[data.index].downloading = false
                this.files[data.index].class = 'is-danger'
            }
        })

    }
})