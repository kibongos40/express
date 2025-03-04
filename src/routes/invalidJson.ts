import { NextFunction, Request, Response } from "express";



function invalidJson(err: Error, req: Request, res: Response, next: NextFunction): any {
	if (err && "body" in err) {
		console.error(err);
		return res.status(400).send({ status: "fail",message: err.message }); // Bad request
	}
	next();
};

export default invalidJson;