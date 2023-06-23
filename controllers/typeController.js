const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res, next) {
        const {name} = req.body
        if (!name) {
            return next(ApiError.badRequest('Название типа не указано'))
        }
        const type = await Type.create({name})
        return res.json(type)
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const type = await Type.findOne(
                {
                    where: {id},
                },
            )
            return res.json(type)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }
    
    async delete(req, res) {
        const {id} = req.params
        await Type.destroy(
            {
                where: {id}
            }
        )

        return res.json(id)
    }
}

module.exports = new TypeController()