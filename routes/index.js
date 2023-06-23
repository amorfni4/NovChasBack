const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const basketProductRouter = require('./basketProductRouter')
const paymentRouter = require('./paymentRouter')
const dealRouter = require('./dealRouter')
const dealProductRouter = require('./dealProductRouter')

router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/type', typeRouter)
router.use('/basket', basketProductRouter)
router.use('/payment', paymentRouter)
router.use('/deal', dealRouter)
router.use('/dealproduct', dealProductRouter)

module.exports = router