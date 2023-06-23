const Router = require('express')
const router = new Router()
const paymentController = require('../controllers/paymentController')

router.post('/', paymentController.payForProducts)
router.post('/hook', paymentController.paymentWebHook)

module.exports = router