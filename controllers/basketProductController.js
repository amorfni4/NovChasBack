const { BasketProduct, Product } = require('../models/models')
const ApiError = require('../error/ApiError')
const { Sequelize } = require('../db')
const { Op } = require('sequelize')

class ProductToBasketController {
    

    async incrementProductToBasket(req, res, next) {
        try {
            const {userId, productId} = req.body
            const basketProduct = await BasketProduct.create({userId, productId})
            return res.json(basketProduct)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async decrementProductFromBasket(req, res, next) {
        try {
            const {userId, productId} = req.body
            const basketProduct = await BasketProduct.findOne({userId, productId})

            await basketProduct.destroy({});

            return res.json(basketProduct)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllFromOneBasket(req, res, next) {
        try {
            const {userId} = req.params
            const product = await BasketProduct.findAll(
                {
                    attributes: [[Sequelize.fn('COUNT', Sequelize.col('productId')), 'count']],
                    include: {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'img']
                    },
                    where: {userId},
                    group: ['basket_product.productId', 'product.id'],
                }
            )
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {userId, productId} = req.query

            const basketProduct = await BasketProduct.findOne({
                    where: {
                        [Op.and]: [
                            {userId},
                            {productId}
                        ]
                    }
                })
                
            return res.json(basketProduct)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteProductFromBasket(req, res) {
        const {userId, productId} = req.query
        const product = await BasketProduct.destroy(
            {
                where: {userId, productId}
            }
        )
        return res.json(product)
    }
}

module.exports = new ProductToBasketController()