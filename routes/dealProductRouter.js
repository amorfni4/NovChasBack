const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')
const dealProductController = require('../controllers/dealProductController')

router.get('/:dealId', dealProductController.getAllFromDeal)

module.exports = router