const express = require('express');
const router = express.Router;


module.exports = () => {
    router.post('login', login);

    function login(req,res) { 
        
    }

    return router;
}