const db = require('../database/localDatabase')


class Controller {

    heroesField = {
        name: 'string',
        strength: 'number',
        dexterity: 'number',
        intellect: 'number',
        isInvincible: 'boolean'
    }

    checkHeroStatsValue(heroesValue) {

        if (Object.keys(heroesValue).length !== Object.keys(this.heroesField).length) {
            return {
                status: 'error',
                description: 'incorrect count of fields for hero'
            }
        }

        for (let fieldsName in this.heroesField) {
            if (!(Object.keys(heroesValue).includes(fieldsName) &&
                (this.heroesField[fieldsName] === typeof heroesValue[fieldsName]))) {
                return {
                    status: 'error',
                    description: 'incorrect name or type of fields for hero'
                }
            }
        }

        return {
            status: 'success'
        }
    }

    async setHeroStats(req, res) {
        try {
            const check = this.checkHeroStatsValue(req.body)

            if (check.status === 'error') {
                res.status(400).json(check)
                return
            }
            if (await db.isHeroExist()) {
                const hero = await db.updateHeroStats(req.body)
                if (hero) {
                    res.status(200).json({
                        status: 'success',
                        description: 'Parameters of hero updated successfully'
                    })
                }
                return
            }
            const hero = await db.createHero(req.body)

            if (hero) {
                res.status(200).json({
                    status: 'success',
                    description: 'Parameters of hero saved successfully'
                })
            }
        } catch (e) {
            res.status(500).json({
                status: 'error',
                description: 'unexpected problem on the server'
            })
        }
    }

    async getHeroStats(req, res) {
        try {
            const hero = await db.getHeroStats()

            if (hero) {
                res.status(200).json(hero)
            } else {
                res.status(200).json({
                    status: 'error',
                    description: 'the hero has not been created yet'
                })
            }
        } catch (e) {
            res.status(500).json({
                status: 'error',
                description: 'unexpected problem on the server'
            })
        }
    }

    async uploadHeroImage(req, res) {
        try {
            if (!(req.files && req.files.avatar)) {
                res.status(400).json({
                    status: 'error',
                    description: 'Problem with upload picture. Check value of attribute name'
                })
                return
            }
            if (req.files.avatar.size > 1048576) {  // check upload limit 1 MB
                res.status(200).json({
                    status: 'error',
                    description: 'image size limit (1 MB) exceeded'
                })
                return
            }
            if (await db.uploadImage(req.files.avatar)) {
                res.status(200).json({
                    status: 'success',
                    description: 'picture uploaded successfully'
                })
                return
            } else {
                throw new Error('Problem with upload picture')
            }
        } catch {
            res.status(500).json({
                status: 'error',
                description: 'Problem with upload picture'
            })
        }
    }


    async getHeroImage(req, res) {
        try {
            const image = await db.getImage()
            if (!image) {
                res.status(200).json({
                    status: 'error',
                    description: 'the picture has not been uploaded yet'
                })
                return
            }
            res.sendFile(image)
        } catch {
            res.status(500).json({
                status: 'error',
                description: 'problem with getting image'
            })
        }
    }
}


module.exports = new Controller()