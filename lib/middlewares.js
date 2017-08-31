const routes = require('express').Router();
const sha256 = require('sha256');

routes.use('/api', function (req, res, next) {
    console.log('checking authorization');

    if(req.method == "GET" ){
        next();
    }else if(req.body.key && sha256(req.body.key) == process.env.API_KEY){
        next();
    }else{
        res.sendStatus(401);
    }
});

routes.use('/api',function(req,res,next){
    req.userDetails = {};

    if(process.env.ENVIRONMENT == "pro"){
        console.log("PRODUCTION");
        req.userDetails.username = req.body.username;
        req.userDetails.password = req.body.password;
        next();
    }else if(process.env.ENVIRONMENT == "dev"){
        console.log("DEVELOPMENT");
        req.userDetails.username = process.env.STUDENT_ID;
        req.userDetails.password = process.env.STUDENT_PASSWORD;
        next();
    }else{
        console.error("ENVIRONMENT IS NOT SET APPROPRIATELY");
        res.sendStatus(400);
    }
});

module.exports = routes;