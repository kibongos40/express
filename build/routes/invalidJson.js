"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invalidJson(err, req, res, next) {
    if (err && "body" in err) {
        console.error(err);
        return res.status(400).send({ status: "fail", message: err.message }); // Bad request
    }
    next();
}
;
exports.default = invalidJson;
