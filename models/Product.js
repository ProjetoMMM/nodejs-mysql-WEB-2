const {DataTypes} = require('sequelize')

const db = require('../db/conn')

// Ligação com o User
const User = require('./User')

// pname = nome do produto, pqty = quantidade, reqst = boolean pra conseguir diferenciar requisições dos agronomos de disponibilidades do agricultor
const Product = db.define('Product', {
    pname: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    pqty: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    reqst: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        required: true
    }
})

Product.belongsTo(User)
User.hasMany(Product)

module.exports = Product
