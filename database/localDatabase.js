const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises
const fileServices = require('../services/fileServices')


class localDatabase {

    constructor() {
       this.heroFolderPath = path.resolve(__dirname +  '/heroFolder')

       if (!fs.existsSync(this.heroFolderPath)) {
           fs.mkdirSync(this.heroFolderPath)
       }
       this.dbHeroesFilePath = path.resolve(__dirname +  '/heroFolder/heroParams.txt')
       this.dbAvatarFilePath = path.resolve(__dirname +  '/heroFolder/heroAvatar.txt')
    }

    async checkFileExists(filePath) {
        try {
            await fsPromises.access(filePath)
            return true
        } catch {
            return false
        }
    }

    async isHeroExist() {
        try {
            if (!(await this.checkFileExists(this.dbHeroesFilePath))) {
                return false
            }
            const heroData = await fsPromises.readFile(this.dbHeroesFilePath, 'utf8')
            const heroStats = JSON.parse(heroData)

            if (Object.keys(heroStats).length < 1) {
                return false
            }
            return heroStats
        } catch {
            return false
        }
    }

    async updateHeroStats(data) {
        try {
            await fsPromises.writeFile(this.dbHeroesFilePath, JSON.stringify(data))
            return true
        } catch {
            return false
        }
    }

    async createHero(data) {
        try {
            await fsPromises.writeFile(this.dbHeroesFilePath, JSON.stringify(data))
            return true
        } catch {
            return false
        }
    }

    async getHeroStats() {
        try {
            const heroData = await fsPromises.readFile(this.dbHeroesFilePath, 'utf8')
            const heroStats = JSON.parse(heroData)

            return heroStats
        } catch {
            return false
        }
    }

    async isHeroImageExists() {
        try {
            if (!(await this.checkFileExists(this.dbAvatarFilePath))) {
                return false
            }
            const data = await fsPromises.readFile(this.dbAvatarFilePath, 'utf8')
            const image = JSON.parse(data)

            if (Object.keys(image).includes('avatarPath') && image['avatarPath']) {
                return path.resolve(this.heroFolderPath + '/' + image['avatarPath'])
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    async uploadImage(file) {
        try {
            const pathImageExists = await this.isHeroImageExists()

            if (pathImageExists) {
                await fsPromises.unlink(pathImageExists)
                await fsPromises.unlink(this.dbAvatarFilePath)
            }
            const filePath = fileServices.saveFile(file, this.heroFolderPath)

            if (!filePath) {
                return false
            }
            await fsPromises.writeFile(this.dbAvatarFilePath, JSON.stringify({
                avatarPath: filePath
            }))
            return true
        } catch {
            return false
        }
    }

    async getImage() {
        try {
            const pathImageExists = await this.isHeroImageExists()

            if (pathImageExists) {
                return pathImageExists
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

}



module.exports = new localDatabase()