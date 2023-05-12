const UserModel = require("../models/UserModel");

exports.checkDuplicateEntries = (req, res, next) => {


    UserModel.findOne({
        email: req.body.email
    }).exec((err, email) => {
        if (err) {
            console.log(err);
            return;
        }
        if (email) {
            return res.redirect("/");
        }
        const password = req.body.password;
        const confirm = req.body.confirmpassword;
        if (password !== confirm) {
            return res.redirect("/register");
        }
        next();
    })


}