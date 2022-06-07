const User = require('../models/User')
const Product = require('../models/Product')

module.exports = class ProductController {

    static async dashboard(req, res){
        const userId = req.session.userid

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Product,
            plain: true,
        })

        // checagem
        if(!user) {
            res.redirect('/login')
        }

        const products = user.Products.map((result) => result.dataValues)

        res.render('products/dashboard', {style: "Dstyles.css", products})
    }

    static criarReq(req, res) {
        res.render('products/criar', {style: "Cstyles.css"})
    }

    static async criarReqSave(req, res) {
        const product = {
            pname: req.body.pname,
            pqty: req.body.pqty,
            UserId: req.session.userid,
            reqst: req.body.reqst
        }

        try{
            Product.create(product)

            req.flash('message', 'Requisição feita com sucesso!')

            req.session.save(() => {
                res.redirect('/products/dashboard')
            })
        }catch(error) {
            console.log(error)
        }
    }

    static redefinirProd(req, res) {
        const id = req.params.id
        const userId = req.session.userid

        const product = Product.findOne({raw:true, where: {id: id, UserId: userId}})
        res.render('products/redefinirProd', {style: "RedStyles.css"})
    }

    static async redefinirProdPost(req, res) {
        const id = req.body.id
        const userId = req.body.UserId

        const novoProduct = {
            pname: pname,
            pqty: pqty
        }

        const user = await Product.update(novoProduct, {where:{id: id, UserId: userId}})

        if(!user){
            req.flash('message', 'Esse produto não existe!')
            res.render('products/dashboard')

            return
        }

        res.render('products/dashboard')
    }

    static async redefinirProd(req, res) {
        const id = req.params.id

        const product = await Product.findOne({where: {id: id}, raw: true})

        res.render('products/redefinirProd', {product})
    }

    static async redefinirProdPost(req, res) {
        const id = req.body.id

        const product = {
            pname: req.body.pname,
            pqty: req.body.pqty
        }

       try{

            await Product.update(product, {where: {id: id}})

            req.flash('message', 'Produto atualizado!')

            req.session.save(() => {
                res.redirect('/products/dashboard')
            })

       }catch(error){
           console.log(error)
       }
    }

    static async deletarProd(req, res) {
        const id = req.body.id
        const userId = req.session.userid

        await Product.destroy({where: {UserId: userId, id: id}})

        res.render('products/dashboard', {style: "Dstyles.css"})
    }
}
