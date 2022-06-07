const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/cadastro', AuthController.cadastro)
router.post('/cadastro', AuthController.cadastroPost)
router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)
router.get('/redefinir', AuthController.redefinir)
router.post('/redefinir', AuthController.redefinirPost)
router.get('/', AuthController.home)
router.get('/logout', AuthController.logout)

module.exports = router
