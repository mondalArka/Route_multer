const UserModel = require('../models/UserModel');
const DoctorModel = require('../models/DoctorModel')
const BlogModel = require('../models/BlogModel');
const AboutModel = require('../models/AboutModel');
const TokenModel = require('../models/TokenModel');
const CommentModel = require('../models/CommentModel');
const ContectModel = require('../models/ContactModel');
const CategoryModel = require('../models/CategoryModel');
const AppointmentModel = require('../models/AppointmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const flash = require('connect-flash');
const { aggregate } = require('../models/UserModel');


// User Auth

const userAuth = (req, res, next) => {
    if (req.user) {
        console.log(req.user);
        next();
    } else {
        console.log(req.user);
        res.redirect("/login");
    }
}

// Register

const register = (req, res) => {
    res.render("./user/register", {
        title: '+Medical | Registration',
        data: req.user,
        message: req.flash('message'),
    })
}


const CreateRegister = (req, res) => {
    UserModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        age: req.body.age,
        gender: req.body.gender,
        about: req.body.about,
        userImage: req.file.filename,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).save((err, user) => {
        if (!err) {
            // generate token
            TokenModel({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }).save((err, token) => {
                if (!err) {
                    var transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "rjbag8942@gmail.com",
                            pass: "nzihsbgwmlthcigc"
                        }
                    });
                    var mailOptions = {
                        from: 'no-reply@sd.com',
                        to: user.email,
                        subject: 'Account Verification',
                        text: 'Hello ' + req.body.username + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                    };
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log("Techniclal Issue...");
                        } else {
                            req.flash("message", "A Verfication Email Sent To Your Mail ID.... Please Verify By Click The Link.... It Will Expire By 24 Hrs...");
                            res.redirect("/register");
                        }
                    });
                } else {
                    console.log("Error When Create Token...", err);
                }
            })

        } else {
            console.log("Error When Create User...", err);
        }
    })
}

// Mail Verification

const conformation = (req, res) => {
    TokenModel.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            console.log("Verification Link May Be Expired :(");
        } else {
            UserModel.findOne({ _id: token._userId, email: req.params.email }, (err, user) => {
                if (!user) {
                    req.flash("message", "User Not Found");
                    res.redirect("/login");
                } else if (user.isVerified) {
                    req.flash("message", "User Already Verified");
                    res.redirect("/login");
                } else {
                    user.isVerified = true;
                    user.save().then(result => {
                        req.flash("message", "Your Account Verified Successfully");
                        res.redirect("/login");
                    }).catch(err => {
                        console.log("Something Went Wrong...", err);
                    })
                }
            })
        }
    })
}

// Login

const login = (req, res) => {
    loginData = {}
    loginData.email = (req.cookies.email) ? req.cookies.email : undefined
    loginData.password = (req.cookies.password) ? req.cookies.password : undefined
    res.render("./user/login-register", {
        title: "+Medical | Login",
        data: req.user,
        data1: loginData,
        message: req.flash('message'),
    })
}

const signin = (req, res) => {
    UserModel.findOne({
        email: req.body.email
    }).exec((err, data) => {
        if (data) {
            if (data.isVerified) {
                const hashPassword = data.password;
                if (bcrypt.compareSync(req.body.password, hashPassword)) {
                    const token = jwt.sign({
                        id: data._id,
                        Picture: data.userImage,
                        firstname: data.firstname
                    }, "sdsubhajit@2406", { expiresIn: '20m' });
                    res.cookie("token", token);
                    if (req.body.rememberme) {
                        res.cookie('email', req.body.email)
                        res.cookie('password', req.body.password)
                    }
                    console.log("login success",);
                    req.flash("message", "Login Successfully");
                    console.log(data.firstname);
                    res.redirect("/");
                } else {
                    console.log("Invalid Password...");
                    // res.redirect("/");
                    req.flash("message", "Invalid Password");
                    res.redirect("/login");
                }
            } else {
                // console.log("Account Is Not Verified");
                req.flash("message", "Account Is Not Verified");
                res.redirect("/login");
            }
        } else {
            console.log("Invalid Email...");
            // res.redirect("/");
            req.flash("message", "Invalid Email");
            res.redirect("/login");
        }
    })
}

// User Logout
const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
    req.flash("message", "Logout Successfully");
}

const home = (req, res) => {
    AboutModel.find().then(data => {
        DoctorModel.find().limit(3).then(result => {
            BlogModel.find().then(blogdata => {
                res.render("./user/index", {
                    title: '+Medical | Home',
                    data: req.user,
                    AboutData: data,
                    doctors: result,
                    blogs: blogdata,
                    message: req.flash("message"),
                    // alert: req.flash("alert"),
                })
            }).catch(error => {
                console.log(error);
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}


const about = (req, res) => {
    AboutModel.find().then(data => {
        DoctorModel.find().limit(3).then(result => {
            res.render("./user/about", {
                title: '+Medical | About Us',
                data: req.user,
                AboutData: data,
                doctors: result,
                message: req.flash("message"),
                // alert: req.flash("alert"),
            })
        }).catch(error => {
            console.log(error);
        })

    }).catch(err => {
        console.log(err);
    })
}

// User Profile

const userProfile = (req, res) => {
    UserModel.findById(req.user.id).then(result => {
        AppointmentModel.aggregate([{ $match: { "name": req.user.firstname } }]).then(result2 => {
            console.log(result2);
            res.render('./user/userProfile', {
                title: '+Medical | Profile',
                data: req.user,
                displaydata: result2,
                user: result,
            })
        })
    })
}





// User Contact Page
const contact = (req, res) => {
    res.render("./user/contact", {
        title: '+Medical | Contact us',
        data: req.user,
        message: req.flash('message'),
        alert: req.flash('message')
    })
}

const createContact = (req, res) => {
    const contectdata = new ContectModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
    })
    contectdata.save().then(data => {
        req.flash('message', 'Thank you for Contacting us. we will get back to you soon!')
        res.redirect('/contact')
        console.log(data);
    }).catch(err => {
        req.flash('message', 'Contact failed....')
        res.redirect('/contact')
    })
}


const department = (req, res) => {
    CategoryModel.find((err, data) => {
        if (!err) {
            res.render('./user/department', {
                title: '+Medical | Department',
                categorys: data,
                data: req.user
            })
        }
    })
}
// Appointment

const Appointment = (req, res) => {
    AppointmentModel.find().then(result => {
        CategoryModel.find().then(data => {
            res.render('./user/apointment', {
                title: '+Medical | Appointment',
                displayresult: result,
                displaydata: data,
                data: req.user,
                message: req.flash('message')
            })
        })
    })
}
const addAppoiment = (req, res) => {
    AppointmentModel({
        name: req.user.firstname,
        phone: req.body.phone,
        bookAt: req.body.bookAt,
        specialist: req.body.specialist,
        message: req.body.message,
    }).save().then(result => {
        res.redirect("/appointment")
        req.flash("message", "Appointment Book successfully")
    })
}



// Doctor
const doctor = (req, res) => {
    DoctorModel.find((err, data) => {
        if (!err) {
            res.render('./user/doctor', {
                title: '+Medical | Doctor',
                doctors: data,
                data: req.user
            })
        }
    })
}


const doctorProfile = (req, res) => {
    DoctorModel.find({ slug: req.params.slug }).then(result => {
        res.render("./user/doctor-profile", {
            title: '+Medical | Doctor Profile',
            data: req.user,
            doctors: result,
            // message: req.flash("message"),
            // alert: req.flash("alert"),
        })
    }).catch(error => {
        console.log(error);
    })
}



const blog = (req, res) => {
    BlogModel.find().sort('-createdAt').then(result => {
        res.render("./user/blog", {
            'title': '+Medical || Blog',
            data: req.user,
            blogs: result,
            // message: req.flash("message"),
            // alert: req.flash("alert"),
        })
    }).catch(error => {
        console.log(error);
    })
}




const search = (req, res) => {
    if (req.user) {
        UserModel.findById(req.admin.id).then(result3 => {
            BlogModel.aggregate([
                { $match: { post: req.body.input } }
            ]).then(result => {
                console.log(result);
                res.render('./user/blog', {
                    title: "blog page",
                    data: req.user,
                    Postdata: result3,
                    blogs: result,
                })
            })
        })
    } else {
        BlogModel.aggregate([
            { $match: { title: req.body.input } }
        ]).then(result => {
            console.log(result);
            res.render('./user/blog', {
                title: "blog page",
                data: req.user,

            })
        })
    }
}




const blog_details = (req, res) => {
    BlogModel.find({ slug: req.params.slug }).sort('-createdAt').then(result => {
        CommentModel.find().sort('-createdAt').then(data => {
            res.render("./user/blog-details", {
                title: '+Medical | Blog details',
                data: req.user,
                blogs: result,
                comment: data,
                message: req.flash("message"),
                alert: req.flash("alert"),
            })
        }).catch(error => {
            console.log(error);
        })
    }).catch(error => {
        console.log(error);
    })
}


// Comment section
const addComment = (req, res) => {
    const id = req.body._id
    CommentModel({
        post: req.body.post,
        comment: req.body.comment,
        name: req.body.name,
        email: req.body.email,
        website: req.body.website,
    }).save().then(result => {
        console.log("Comment Added...");
        res.redirect(`/blog-single/${req.body.slug}`);
    }).catch(err => {
        console.log("Comment Not Added...", err);
        res.redirect(`/blog-single/${req.body.slug}`);
    })
}




// For User Department 

const Cardiology = (req, res) => {
    DoctorModel.aggregate([{ $match: { specialist: "Cardiology" } }]).then(result => {
        res.render('./user/doctor', {
            title: '+Medical | Cardiology',
            doctors: result,
            data: req.user
        })
    })
}

const Dentist = (req, res) => {
    DoctorModel.aggregate([{ $match: { specialist: "Dentist" } }]).then(result => {
        res.render('./user/doctor', {
            title: '+Medical | Dentist',
            doctors: result,
            data: req.user
        })
    })
}
const Neurology = (req, res) => {
    DoctorModel.aggregate([{ $match: { specialist: "Neurology" } }]).then(result => {
        res.render('./user/doctor', {
            title: '+Medical | Neurology',
            doctors: result,
            data: req.user
        })
    })
}
const Gastrology = (req, res) => {
    DoctorModel.aggregate([{ $match: { specialist: "Gastrology" } }]).then(result => {
        res.render('./user/doctor', {
            title: '+Medical | Gastrology',
            doctors: result,
            data: req.user
        })
    })
}
const Arthrology = (req, res) => {
    DoctorModel.aggregate([{ $match: { specialist: "Arthrology" } }]).then(result => {
        res.render('./user/doctor', {
            title: '+Medical | Arthrology',
            doctors: result,
            data: req.user
        })
    })
}


module.exports = {
    userAuth,
    register,
    CreateRegister,
    conformation,
    login,
    signin,
    logout,

    home,
    about,
    contact,
    userProfile,
    createContact,
    department,
    doctor,
    doctorProfile,
    blog,
    blog_details,
    Appointment,
    addAppoiment,
    addComment,
    search,


    Cardiology,
    Dentist,
    Neurology,
    Gastrology,
    Arthrology
}