const Vue = require('./vue')
const { ipcRenderer } = require('electron')
require('./app')

const fs = require('fs')

new Vue({
    el: '#app',
    data: {
        currentStep: 0,
        teamName: 'New Team',
        teamPassword: '',
        allowSignup: true,
        useStorage: true,
        storageFileList: '.jpg,.jpeg,.png,.gif',
        answersList: ['Yes', 'No'],
        configData: '',
        firebaseData: {
            apiKey: '',
            authDomain: '',
            databaseURL: '',
            projectId: '',
            storageBucket: ''
        },
        joinPassport: '',
        passportFolder: '',
        teamResult: '',
        isDataChecked: false
    },
    methods: {
        createTeam() {
            let passport = {
                "teamName": this.teamName,
                "allowSignup": this.allowSignup,
                "useStorage": this.useStorage,
                "storageFileList": this.storageFileList,
                "apiKey": this.firebaseData.apiKey,
                "authDomain": this.firebaseData.authDomain,
                "databaseURL": this.firebaseData.databaseURL,
                "projectId": this.firebaseData.projectId,
                "storageBucket": this.firebaseData.storageBucket
            }

            ipcRenderer.send('team.passport.enc', { text: JSON.stringify(passport), password: this.teamPassword })

            setTimeout(() => {
                this.isDataChecked = false
                this.teamResult = ''
            },2500)
        },
        passportDir(event) {
            this.passportFolder = event.target.files[0].path
        },
        checkData() {
            if (this.teamName == '' ||
                this.teamPassword == '' ||
                this.firebaseData.apiKey == '' ||
                this.firebaseData.projectId == '' ||
                this.firebaseData.databaseURL == '' ||
                this.firebaseData.authDomain == '' ||
                this.passportFolder == '') {
                    this.teamResult = 'No Valid Data'
                    this.isDataChecked = false
            } else {
                this.teamResult = 'OK'
                this.isDataChecked = true
            }
        }
    },
    created() {
        ipcRenderer.on('team.passport.enc', (event, data) => {
            //this.joinPassport = data
            fs.writeFile(`${this.passportFolder}/${this.teamName}.utpassport`, data, err => {
                if (!err) {
                    console.log('done')
                }
            })
        })
    }
})