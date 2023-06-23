const Router = require('express')
const router = new Router()
const basketProductController = require('../controllers/basketProductController')

router.get('/:userId', basketProductController.getAllFromOneBasket)
router.get('/', basketProductController.getOne)
router.post('/', basketProductController.incrementProductToBasket)
router.delete('/wholeProduct', basketProductController.deleteProductFromBasket)
router.delete('/oneOfManyProduct', basketProductController.decrementProductFromBasket)

module.exports = router