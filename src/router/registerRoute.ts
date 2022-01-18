import express from 'express';
import bcrypt from 'bcryptjs';
import {body, validationResult} from 'express-validator';
import mysql from 'mysql';
import {connection} from '../index';

const registerRoute: express.Router = express.Router();

registerRoute.get('/getUser',(req: express.Request,res: express.Response)=>{
    let sql = "SELECT * FROM `registered_user`";
    connection.query(sql, (err,result)=>{
        if(err){
            res.sendStatus(400).send(err);
        }else{
            console.log("query success");
            res.json(result);
        }
    })
});


registerRoute.post('/user', [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Email is required"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters")
] , async(req: express.Request,res: express.Response) => {

    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.sendStatus(400).send({errors: errors.array()});
    };
    
    try{
        const {name, email, password} = req.body;
        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(password, salt);
        const registeredUser = {
            name : name,
            email : email,
            password : hashedPass
        }
        
        let query = `INSERT INTO registered_user (name, email, password) VALUES (?, ?, ?);`;
        

        connection.query(query, [registeredUser.name, registeredUser.email, registeredUser.password], (err)=>{
            if(err){
                res.send(err);
                
            }else{
                res.send("Registered successfully");
            }
        })
        


    } catch (err) {
        res.sendStatus(500).send("error occured");
    }

    

});

// registerRoute.put("/update/:id", [
//     body('author').not().isEmpty().withMessage("author is required"),
//     body('content').not().isEmpty().withMessage("content is required")
// ], async (req: express.Request,res: express.Response)=>{
//     const id = req.params.id;

// })

export default registerRoute;
