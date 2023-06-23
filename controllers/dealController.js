const { Deal, User } = require('../models/models')
const ApiError = require('../error/ApiError')

class DealController {
    async getAll(req, res, next) {
        try {
            const deals = await Deal.findAll({
                include: {
                    model: User,
                    attributes: ['email']
                },
                where: {status: "CONFIRMED"}
            })

            return res.json(deals)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async setGiven(req, res, next) {
        try {
            const {id} = req.body
            const deal = await Deal.findOne({where: id})

            deal.status = "GIVEN"
            await deal.save()

            return res.json(deal)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new DealController()