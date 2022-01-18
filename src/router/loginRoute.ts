import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connection } from '../index';
import { secret_key } from './../secret';


const loginRoute : express.Router = express.Router();

loginRoute.post("/", (req: express.Request, res: express.Response) => {
    let {email, password} = req.body;
    var sql = 'SELECT * FROM registered_user WHERE email = ?';
    connection.query(sql,[email], (err, result) => {
        if(err) {
            res.sendStatus(400).send("Login failed");
        } else{
            if(result && result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, loginResult) => {
                    if(loginResult === true){ 
                        // res.sendStatus(200).send('Login successful!');
                        const token = jwt.sign({
                            username: result[0].name,
                            userId: result[0].id
                        }, secret_key,{
                            expiresIn: '1h'
                        });
                        res.json({
                            token: token,
                            login: true
                        })
                    }else{
                        res.status(400).json({"error": "authentication failed"});
                    };
                });
            }
            else{
                res.sendStatus(400).send("Login failed");
            };
        }
    })
});

export default loginRoute;