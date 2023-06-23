const { BasketProduct, Product, Deal, DealProduct } = require('../models/models')
const ApiError = require('../error/ApiError')
const { Sequelize } = require('../db')
const axios = require('axios');
const {v4: uuidv4} = require('uuid')

class PaymentController {
    async payForProducts(req, res) {
        try {
            const {userId, basketProducts} = req.body

            const url = "https://api.yookassa.ru/v3/payments";
            const initial_payment_msg = "Списываем оплату за заказ";
            
            const idempotenceKey = uuidv4();

            const deal = await Deal.create({userId, status: 'WAITING'})
            const dealId = deal.id

            let totalPrice = 0

            await Promise.all(basketProducts.map(async product => {
                const deal_product = await DealProduct.create(
                    {
                        amount: product.count, dealId: deal.id, productId: product.product.id
                    })
                const realProduct = await Product.findOne(product.id)
                totalPrice += Number(realProduct.price) * Number(deal_product.amount)
            }))
            
            var params = await {
                "amount": {
                    "value": `${totalPrice}`,
                    "currency": "RUB"
                },
                "payment_method_data": {
                    "type": "bank_card"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": "http://localhost:3000/shop"
                },
                "description": initial_payment_msg,
                "save_payment_method": "false"
            };

            axios.post(url, params, {
                auth: {
                    username: "320025",
                    password: process.env.PAYMENT_KEY,
                },
                headers: { 
                    'Idempotence-Key': idempotenceKey 
                },
            }).then((response) => {
                return response.data;
            }).then(async (response) => {
                if (response.status == "pending") {
                    await Deal.update(
                        {
                            "paymentId": response.payment_method.id
                        }, 
                        {
                            where: {id: dealId}
                        });
                    res.send({"url": response.confirmation.confirmation_url})
                }
            })
            .catch(async e => {
                console.log(e)
                await Deal.update(                    
                    {
                        "status": "ERROR"
                    }, 
                    {
                        where: {id: dealId}
                    }                    
                )
                res.send({
                    "status": "error",
                    "body": e,
                })
            })
        } catch (e) {
            console.log(e)
            res.send({
                "status": "error",
                "body": e,
            })
        }
    }
    
    async paymentWebHook(req, res) {
        if (req.body.event == "payment.waiting_for_capture") {
            let payment_id = req.body.object.id;
            let status = req.body.object.status;
            if (status == "waiting_for_capture") {
                await confirmPayment(payment_id);
                await getPayment(payment_id);
            }
        }
        res.send("OK");
    }
}
    const confirmPayment = async (payment_id) => {
        await Deal.update(
            {
                "status": "CONFIRMED"
            }, 
            {
                where: {paymentId: payment_id}
            }     
        )

        const deal = await Deal.findOne(
            {
                where: {paymentId: payment_id}
            }
        )
        const userId = deal.userId

        await BasketProduct.destroy((
            {
                where: {userId: userId}
            }
        ))
    }

    const getPayment = async (payment_id) => {
        const url = `https://api.yookassa.ru/v3/payments/${payment_id}/capture`;

        return await axios.post(url, {}, {
            auth: {
                username: "320025",
                password: process.env.PAYMENT_KEY,
            },
            headers: { 
                'Idempotence-Key': uuidv4().toString() 
            }
        }).then((res) => res.data).then(async (res) => {
            return true;
        }).catch((err) => {
            return false;
        });
    }

module.exports = new PaymentController()