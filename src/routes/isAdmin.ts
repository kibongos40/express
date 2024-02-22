import express, { Express, NextFunction, Request, Response } from "express"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config();

function isAdmin(req: Request, res:Response, next:NextFunction){
    try{
        if(req.headers.authorization){
            let token = req.headers.authorization.split(" ")[1];
            if(!jwt.verify(token, process.env.JWT_SECRET as string)){
                return res.status(401).json({
                    "status":"fail",
                    "message":"Invalid token"
                });
            }
            next();
        }
        else{
            console.log("Unauthorised");
            res.status(423).json({ error: "Unauthorised"});
        }
    }
    catch{
        res.status(403).json({
            "status":"fail",
            "message": "Invalid token"
        });
    }
}

export default isAdmin;