import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import HttpException from "../utils/exceptions/http.exception.js";

const generateToken = (email,next)=>{
    try{
        const user = User.findOne({email});
        const token = jwt.sign({
            username: user.username,
            email
        },process.env.JWT_SECRET_KEY,{
            expiresIn:"5m"
        });
        return token;
    }catch(err){
        return next(new HttpException(500,err));
    }
}

export {
    generateToken
}