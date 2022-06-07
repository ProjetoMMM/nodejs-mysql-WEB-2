// Importar Usuário
const User = require('../models/User')

// Importar biblioteca para criptografar a senha
const bcrypt = require('bcryptjs')

// Funçoes para abrir rotas
module.exports = class AuthController{

    static cadastro(req, res) {
        res.render('auth/cadastro', {style: "styles.css"})
    }

    static async cadastroPost(req, res) {
        // pegando dados do POST vindo do front
        const {name, email, password, confirmpassword, cell, state} = req.body

        if(password != confirmpassword){
            req.flash('message', 'As senhas não batem!')
            res.render('auth/cadastro', {style: "styles.css"})

            return
        }

        // checar se já existe esse email cadastrado
        const checagem = await User.findOne({where: {email: email}})

        if(checagem) {
            req.flash('message', 'Já existe uma conta com esse e-mail!')
            res.render('auth/cadastro', {style: "styles.css"})
        }

        // criar a senha criptografada
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
            cell,
            state,
        }

        try{ 
            const novoUser = await User.create(user)

            // criar um id de sessao
            req.session.userid = novoUser.id

            req.flash('message', 'Seu cadastro foi realizado!')

            req.session.save(() => {
                res.redirect('/')
            })
        }catch(err) {
            console.log(err)
        }
    }

    static login(req, res) {
        res.render('auth/login', {style: "Lstyles.css"})
    }

    static async loginPost(req, res) {
        // Pegar do front as informações
        const {email, password} = req.body

        // Checar se já existe esse usuário
        const user = await User.findOne({where: {email: email}})

        if(!user){
            req.flash('message', 'Esse login não existe!')
            res.render('auth/login', {style: "Lstyles.css"})

            return
        }

        // checar se senha fornecida bate com a senha do banco
        const check = bcrypt.compareSync(password, user.password)

        if(!check) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login', {style: "Lstyles.css"})

            return
        }

        req.session.userid = user.id

        // salvar a sessao do usuário
        req.session.save(() => {
            res.redirect('/')
        })
    }

    static redefinir(req, res) {
        res.render('auth/redefinir', {style: "Rstyles.css"})
    }

    static async redefinirPost(req, res) {
        const {name, email, password, confirmpassword} = req.body
        
        const user = User.findOne({where: {name: name, email: email }})

        // checar se o usuário existe
        if(!user) {
            req.flash('message', 'Esse usuário não existe!')
            res.render('auth/cadastro', {style: "styles.css"})

            return
        }

        if(password != confirmpassword) {
            req.flash('message', 'As senhas não batem!')
            res.render('auth/login', {style: "Lstyles.css"})

            return
        }

        // criptografia da senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // redefinir senha
        await User.update({password: hashedPassword}, {where: {name: name ,email: email}})

        res.render('auth/home')
    }

    static home(req, res) {
        res.render('auth/home', {style: "Hstyles.css"})
    }
    
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}
