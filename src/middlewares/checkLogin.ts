import express from 'express';
import  jwt  from 'jsonwebtoken';
import { secret_key } from '../secret';
const checkLogin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {authorization} = req.headers;
    try {
        const token : any = authorization?.split(' ')[1];
        const decoded = jwt.verify(token, secret_key);
        console.log(decoded);
        const {username, userId} = decoded;
        next();
    } catch (error) {
        next("authentication failed");
    }
    
};

export default checkLogin;
