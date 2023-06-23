const { Deal, User, DealProduct, Product } = require('../models/models')
const ApiError = require('../error/ApiError')

class DealProductController {
    async getAllFromDeal(req, res, next) {
        try {
            const {dealId} = req.params
            const products = await DealProduct.findAll({
                include: {
                    model: Product,
                    attributes: ['name', 'img']
                },
                where: {dealId}
            })

            return res.json(products)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new DealProductController()