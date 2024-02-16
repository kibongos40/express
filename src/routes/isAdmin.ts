import express, { Express, NextFunction, Request, Response } from "express"
import dotenv from "dotenv";

dotenv.config();

function isAdmin(req: Request, res:Response, next:NextFunction){
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1];
        if(token == process.env.ADMIN) next();
        else res.status(401).json({
            error: "Invalid token"
        });
    }
    else{
        console.log("Unauthorised");
        res.status(401).json({ error: "Unauthorised"});
    }
}

export default isAdmin;