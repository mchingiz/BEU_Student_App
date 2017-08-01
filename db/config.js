// const express = require('express');
// const app = express();
const router = require('express').Router();

const mongoose = require('mongoose');
const connectionPromise = mongoose.connect('mongodb://localhost:27017/beu',{
    useMongoClient: true
});

// Make our db accessible to our router
connectionPromise.then(function(db){
    console.log('dbConnected');

    router.use(function(req,res,next){
        req.db = db;
        next();
    });
});

module.exports = router;