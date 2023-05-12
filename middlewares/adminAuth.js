const jwt = require("jsonwebtoken");
exports.authJwt = (req, res, next) => {
    if (req.cookies && req.cookies.adminToken) {
        jwt.verify(req.cookies.adminToken, "med@123", (err, data) => {
            req.admin = data
                console.log("fine...", req.admin);

            next()
        })
    } else {
        console.log("");
        next()
    }
}