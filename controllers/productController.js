const uuid = require('uuid')
const {Product} = require('../models/models')
const ApiError = require('../error/ApiError')
const path = require('path')
const { Op } = require('sequelize')

class ProductController {
    async create(req, res, next) {
        try {
            const {name, price, typeId, description} = req.body
            const {img} = req.files

            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
    
            const product = await Product.create({name, description, price, img: fileName, typeId})
    
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let {typeId, limit, page, name} = req.query
            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit
            let products
            if (typeId) {
                products = await Product.findAndCountAll({
                    where: {
                    [Op.and]: [
                        {typeId},
                        {name: {[Op.iLike]: `%${name}%`}}
                    ]}, 
                    limit,
                    offset
                })
            }
            else
            {
                products = await Product.findAndCountAll({ 
                    where: {
                        name: {[Op.iLike]: `%${name}%`}
                    }, 
                    limit, 
                    offset
                })
            } 
            return res.json(products)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }
    
    async getOne(req, res, next) {   
        try {
            const {id} = req.params
            const product = await Product.findOne(
                {
                    where: {id},
                },
            )
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            await Product.destroy(
                {
                    where: {id}
                }
            )
    
            return res.json(id)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProductController()