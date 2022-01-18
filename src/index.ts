import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import path from 'path';
import registerRoute from './router/registerRoute';
import loginRoute from './router/loginRoute';
import postRoute from './router/postRoute';


// configuring app;
const app: express.Application = express();
const port: number = 5000;

// configuring dotenv
dotenv.config({path: path.join(__dirname, 'src', '.env')});

// for receiving form data and encoded data
app.use(express.json());
app.use(express.urlencoded());

// configure database
const dbConnectionConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kaz'
};

// creating connection
export const connection : mysql.Connection = mysql.createConnection(dbConnectionConfig);

// connecting to the database
connection.connect((err)=>{
    if(err){
        console.log("err");
        
    }else{
        console.log("Db connected successfully");
    }
});


// error handler
export const errorHandler = (err : express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(res.headersSent){
        return next(err);
    }
    res.status(500).json({ error: err});
}


app.get("/", (req: express.Request, res: express.Response) => {
    res.send("hello")
});

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/post", postRoute);
app.use(errorHandler);



app.listen(port, ()=>{
    console.log("Server running");
});