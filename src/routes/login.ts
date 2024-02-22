import jwt ,{ Jwt, JwtPayload } from "jsonwebtoken";
import express, { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import dotenv from "dotenv";
import sha256 from "sha256";

dotenv.config()

const loginRoute: Router = express.Router();

loginRoute.use(express.json());
loginRoute.use(express.urlencoded({
    extended: true
}))

// Handling Invalid JSON

loginRoute.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err && "body" in err) {
			console.error(err);
			return res.status(400).send({ message: err.message }); // Bad request
		}
		next();
 });

interface User{
    id: number,
    username: string,
    password: string
}


function validateUser(data: object){
    let schema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

loginRoute.post("/",(req: Request, res: Response)=>{
    console.log(sha256("atlp2024"));
    try{
        if(req.body){
            let check = validateUser(req.body);
            if(check.error){
                return res.json({
                    "status":"fail",
                    "message": check.error.message
                });
            }
            let username = req.body.username;
            let password = sha256(req.body.password);
            let users: User[] = JSON.parse(process.env.USERS || '[]');
            let user: User | undefined = users.find(auser => auser.username === username && auser.password === password);
            if(user){
                let payload: JwtPayload = {
                    "id": user.id,
                    "user": username
                };
                let token = jwt.sign(payload, process.env.JWT_SECRET as string, {
                    expiresIn: "10m"
                });
                res.status(200).json({
                    "status":"success",
                    "token": token,
                    "message": "Login successful"
                });
            }
            else{
                return res.json({
                    "error": "No user found"
                })
            }
        }
        else{
            return res.status(403).json({
                "status": "fail",
                "error": "Username and password required"
            });
        }
    }
    catch{
        res.status(500).json({
            "status": "fail",
            "error": "Server Error"
        });
    }
});

export default loginRoute;