// função para checar se o usuário está logado ou nao
module.exports.checkAuth = function(req, res, next) {
    const userId = req.session.userid

    if(!userId){
        res.redirect('/login')
    }

    next()
}