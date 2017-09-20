const Vue = require('./vue')
const {ipcRenderer} = require('electron')
require('./app')

const {setUserData} = require('electron').remote.require('./main.js')

new Vue({
    el: '#app',
    data: {
        displayName: 'new user',
        defaultEmail: '',
        avatar: 'av_1.png',
        avatarList: [
            'av_1.png',
            'av_2.png',
            'av_3.png',
            'av_4.png',
            'av_5.png',
            'av_6.png',
            'av_7.png',
            'av_8.png',
            'av_9.png',
            'av_10.png',
            'av_11.png',
            'av_12.png',
        ],
        saveMessage: 'Save',
        saveMessageClass: 'is-primary'
    },
    methods: {
        save() {

            ipcRenderer.send('db.user.set', {
                "displayName": this.displayName,
                "defaultEmail": this.defaultEmail,
                "avatar": this.avatar
            })

            this.saveMessage = 'Saved'
            this.saveMessageClass = 'is-success'
            setTimeout(() => {
                this.saveMessage = 'Save'
                this.saveMessageClass = 'is-primary'
            }, 1000)
        },
        setAvatar(newAvatar) {
            this.avatar = newAvatar
            this.save()
        }
    },
    created() {
        ipcRenderer.send('db.user.get')

        ipcRenderer.on('db.user.get', (event, data) => {
            this.displayName = data.displayName
            this.defaultEmail = data.defaultEmail
            this.avatar = data.avatar
            this.userID = data.id

            const ud = {
                displayName: data.displayName,
                defaultEmail: data.defaultEmail,
                avatar : data.avatar
            }

            setUserData(ud)
        })

    }
})