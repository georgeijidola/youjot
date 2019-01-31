module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        res.render('errors/error401')
    }
}