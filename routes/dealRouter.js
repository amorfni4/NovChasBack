const Router = require('express')
const router = new Router()
const dealController = require('../controllers/dealController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', checkRole('ADMIN'), dealController.getAll)
router.post('/', checkRole('ADMIN'), dealController.setGiven)

module.exports = router