const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, ProductController.dashboard)
router.get('/criar', checkAuth, ProductController.criarReq)
router.post('/criar', checkAuth, ProductController.criarReqSave)
router.post('/deletar', checkAuth, ProductController.deletarProd)
router.get('/redefinirProd/:id', checkAuth, ProductController.redefinirProd)
router.post('/redefinirProd', checkAuth, ProductController.redefinirProdPost)

module.exports = router
