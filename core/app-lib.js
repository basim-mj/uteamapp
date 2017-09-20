const {app} = require('electron')
const crypto = require('crypto')
const uuid = require('uuid')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
const db = low(adapter)

db.defaults({
    teams: [], user: {
        displayName: 'None',
        defaultEmail: '',
        avater: ''
    },projects: []
}).write()

class AppDB {

    constructor(objectName) {
        this.objectName = objectName
    }

    add(data) {
        data.id = uuid()
        const obj = db.get(this.objectName).push(data).write()
        return obj
    }

    addByID(data){
        const obj = db.get(this.objectName).push(data).write()
        return obj
    }

    getAll() {
        return db.get(this.objectName).value()
    }

    getByID(id) {
        return db.get(this.objectName).find({ id: id }).value()
    }

    delete(id) {
        db.get(this.objectName).remove({ id: id }).write()
    }

    setData(data) {
        db.set(this.objectName,data).write()
    }

    setDataByID(data,id){
        db.get(this.objectName).find({id: id}).assign(data).write()
    }
}

class TeamPassport {

    constructor() {
        this.algorithm = 'aes256'
    }

    encrypte(text, password) {
        let cipher = crypto.createCipher(this.algorithm, password)
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    }

    decrypte(text, password) {
        try {
            let decipher = crypto.createDecipher(this.algorithm, password)
            let decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8')
            return {success:true,passport:decrypted}
        } catch(e) {
            return {success:false,passport:''}
        }
    }
}

module.exports = {
    TeamPassport,
    AppDB
}