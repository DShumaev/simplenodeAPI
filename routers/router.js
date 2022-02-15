const { Router } = require('express')
const controller = require('../controllers/controller')


const router = Router()

router.get('/getHeroStats', controller.getHeroStats)

router.get('/getHeroImage', controller.getHeroImage)

router.post('/setHeroStats', controller.setHeroStats.bind(controller))

router.post('/uploadHeroImage', controller.uploadHeroImage)


module.exports = router


