import express from 'express';
import {body, validationResult} from 'express-validator';
import {connection} from '../index';
import checkLogin from '../middlewares/checkLogin';

const postRoute: express.Router = express.Router();

postRoute.get("/", checkLogin, (req: express.Request, res: express.Response) => {
    let sql = "SELECT * FROM `posts`";
    connection.query(sql, (err,result)=>{
        if(err){
            return res.status(400).json({"message": err.message});
        } else{
            res.json(result);
        }
    })
});

postRoute.post("/", [
    body('author').not().isEmpty().withMessage("author is required"),
    body('content').not().isEmpty().withMessage("content is required")
], (req: express.Request, res: express.Response) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.sendStatus(400).send({errors: errors.array()})
    };

    try{
        let {author, content} = req.body;
        let sql = `INSERT INTO posts (author, content) VALUES (?, ?);`;
        connection.query(sql, [author, content], (err)=>{
            if(err){
                res.send(err);
                
            }else{
                res.send("posted successfully");
            }
        })

    } catch(err){
        res.send(err);
    }

})

postRoute.put("/update/:id", checkLogin , (req: express.Request, res: express.Response)=>{

    const id = req.params.id;
    const {author, content} = req.body;

    let updateQuery = `UPDATE posts SET author = ?, content = ? WHERE id = ?`;
    
    connection.query(updateQuery, [author, content, id], (err) => {
        if(err){
             res.send("err occured");
        }else{
            res.send("updated successfully");
        };
    });


});


postRoute.delete("/delete/:id", checkLogin , (req: express.Request, res: express.Response)=> {

    const id = req.params.id;
    let DELQuery = `DELETE FROM posts WHERE id = ?`;
    connection.query(DELQuery,[id], (err) => {
        if(err){
             res.json(err)
        }else{
            res.send("Deleted successfully");
            
        }
    })

});


export default postRoute;