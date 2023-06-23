const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Deal = sequelize.define('deal', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING, allowNull: false},
    paymentId: {type: DataTypes.STRING, allowNull: true},
})

const DealProduct = sequelize.define('deal_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, allowNull: false},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    price: {type: DataTypes.INTEGER},
    img: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

User.hasMany(BasketProduct, 
    {
        onDelete: 'CASCADE'
    })
BasketProduct.belongsTo(User)

User.hasMany(Deal)
Deal.belongsTo(User)

Deal.hasMany(DealProduct)
DealProduct.belongsTo(Deal)

Product.hasMany(DealProduct)
DealProduct.belongsTo(Product)

Product.hasMany(BasketProduct,
    {
        onDelete: 'CASCADE'
    })
BasketProduct.belongsTo(Product)

Type.hasMany(Product,
    {
        onDelete: 'CASCADE'
    })
Product.belongsTo(Type)

module.exports = {
    User,
    BasketProduct,
    Product,
    Type,
    Deal,
    DealProduct,
}