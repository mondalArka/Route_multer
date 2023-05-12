const express = require('express');
const router=require('express').Router();
const multer = require('multer');
const path = require('path');
const UserController=require("../controllers/UserController");
const verifysiginin=require('../middlewares/verifysignin');
const UserAuth = require('../middlewares/userAuth')


router.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/upload'), function (error, success) {
            if (error) throw error;
        })
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '_' + path.extname(file.originalname)
        cb(null, name, function (error1, success1) {
            if (error1) throw error1
        })
    }
});
const maxSize = 2 * 1024 * 1024;

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
    limits: {
        fileSize: maxSize
    }
});

// User login 
router.get('/login', UserController.login)
router.post('/signin', UserController.signin)

// Admin And User Register
router.get('/register', UserController.register)
router.post('/signup',upload.single('image'),[verifysiginin.checkDuplicateEntries], UserController.CreateRegister)
router.get("/confirmation/:email/:token", UserController.conformation);

// User profile
router.get('/userProfile', UserController.userProfile);

// All User Pages
router.get('/', UserController.home);
router.get('/about', UserController.about);


router.get('/doctor',UserController.userAuth, UserController.doctor);
router.get('/doctor-profile/(:slug)',UserController.userAuth, UserController.doctorProfile);

router.get('/blog', UserController.blog);
router.get('/blog-single/(:slug)', UserController.blog_details);
router.post('/comment', UserController.addComment);

router.get('/department', UserController.department);
router.get('/appointment',UserController.userAuth, UserController.Appointment);
router.post('/addAppointment' , UserController.addAppoiment)

router.get('/contact', UserController.contact);
router.post('/createContact' , UserController.createContact)

// Search
router.post('/search', UserController.search);

//Category
router.get('/Dentist',UserController.userAuth, UserController.Dentist)
router.get('/Cardiology',UserController.userAuth, UserController.Cardiology)
router.get('/Gastrology',UserController.userAuth, UserController.Gastrology)
router.get('/Arthrology',UserController.userAuth, UserController.Arthrology)
router.get('/Neurology',UserController.userAuth, UserController.Neurology)

// User Logout
router.get('/logout', UserController.logout)




module.exports=router;
