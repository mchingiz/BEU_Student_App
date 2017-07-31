const routes = require('express').Router();
const sha256 = require('sha256');

routes.use('/api', function (req, res, next) {
    console.log('mdw');
    if(sha256(req.body.key) == process.env.API_KEY){
        next();
    }else{
        res.sendStatus(401);
    }
});

module.exports = routes;