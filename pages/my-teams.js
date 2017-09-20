const Vue = require('./vue')
const { ipcRenderer } = require('electron')
const { setFirebaseConfig, setTeamData } = require('electron').remote.require('./main.js')

require('./app')
const fs = require('fs')

new Vue({
    el: '#app',
    data: {
        tab: 0,
        teamPassword: '',
        joinPassport: '',
        teams: [],
        selectedTeam: 0,
        newTeamData: {
            teamName: '',
            allowSignup: false,
            useStorage: false,
            storageFileList: '',
            apiKey: '',
            authDomain: '',
            databaseURL: '',
            projectId: '',
            storageBucket: '',
        },
        canAddTeam: false,
        checkText: 'Check Team'
    },
    computed: {
        team() {
            return this.teams[this.selectedTeam]
        }
    },
    methods: {
        checkTeam() {
            if (this.teamPassword != '' && this.joinPassport != '') {
                ipcRenderer.send('team.passport.dec', { text: this.joinPassport, password: this.teamPassword })
            }
        },
        passportFile(e) {
            fs.readFile(e.target.files[0].path, 'utf-8', (err, data) => {
                if (err) {
                } else {

                    this.joinPassport = data
                }
            })
        },
        addTeam() {
            ipcRenderer.send('db.teams.add', this.newTeamData)
        },
        removeTeam() {
            ipcRenderer.send('db.teams.delete', { id: this.teams[this.selectedTeam]["id"] })
        },
        login() {
            let config = {
                apiKey: this.team.apiKey,
                authDomain: this.team.authDomain,
                databaseURL: this.team.databaseURL,
                projectId: this.team.projectId,
                storageBucket: this.team.storageBucket
            }
            console.log(config)
            setFirebaseConfig(config)

            const teamData = {
                id: this.team.id,
                useStorage: this.team.useStorage,
                name: this.team.teamName,
                allowSignup: this.team.allowSignup,
                storageFileList: this.team.storageFileList
            }

            setTeamData(teamData)

            window.location.href = 'team.html'
        }
    },
    created() {
        ipcRenderer.send('db.teams.getall')

        ipcRenderer.on('team.passport.dec', (event, data) => {
            if (data.success) {
                const team = JSON.parse(data.passport)
                this.newTeamData.teamName = team.teamName
                this.newTeamData.allowSignup = team.allowSignup
                this.newTeamData.useStorage = team.useStorage
                this.newTeamData.storageFileList = team.storageFileList
                this.newTeamData.apiKey = team.apiKey
                this.newTeamData.authDomain = team.authDomain
                this.newTeamData.databaseURL = team.databaseURL
                this.newTeamData.projectId = team.projectId
                this.newTeamData.storageBucket = team.storageBucket

                this.canAddTeam = true
            } else {
                this.checkText = 'invalid passport'
                this.canAddTeam = false
                setTimeout(() => {
                    this.checkText = 'Check Team'
                },2500)
            }

        })

        ipcRenderer.on('db.teams.getall', (event, data) => {
            this.teams = data
        })
    }
})