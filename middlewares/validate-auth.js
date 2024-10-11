const jwt = require('jsonwebtoken');
const NotAuthorizeError= require('../errors/not-authorized-error.js');

const authAdmin = (req, res, next) => {
    try {
        const token = req?.session?.token;
        const payload= jwt.verify(token, process.env.JWT_SECRET);
        if(payload.role==="user"){
            throw new NotAuthorizeError();
        }
        req.userId= payload.id;
        next();
    }
    catch(error){
        throw new NotAuthorizeError();
    }
}

const authUser = (req, res, next) => {
    try {
        const token = req?.session?.token;
        const payload= jwt.verify(token, process.env.JWT_SECRET);
        req.userId= payload.id;
        next();
    }
    catch(error){
        throw new NotAuthorizeError();
    }
}

module.exports = {authAdmin, authUser};