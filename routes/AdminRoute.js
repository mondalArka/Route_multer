const express = require('express');
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const AdminController = require("../controllers/AdminController");
const DoctorController = require('../controllers/DoctorController')


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




router.get('/admin', AdminController.show_login);
router.post('/admin/sigin', AdminController.admin_login);
router.get('/admin/logout', AdminController.logout)

//Admin DashBoard
router.get('/admin/dashboard', AdminController.adminAuth, AdminController.dashboard);

//User Page
router.get('/admin/users', AdminController.adminAuth, AdminController.user);
router.get("/admin/activeuser/(:id)", AdminController.activeUser);
router.get("/admin/deactiveuser/(:id)", AdminController.deActiveUser);
router.get('/admin/remove-user/(:id)', AdminController.deleteUser)

//admin About Page
router.get('/admin/about', AdminController.adminAuth, AdminController.AdminAbout);
router.post('/admin/addabout', upload.single('image'), AdminController.addAbout)
router.get("/admin/activeHeadline/(:id)", AdminController.activeHeadline);
router.get("/admin/deactiveHeadline/(:id)", AdminController.deActiveHeadline);

// Doctor Router
router.get('/admin/doctor', AdminController.adminAuth, DoctorController.doctor);
router.post('/admin/adddoctor', upload.single('image'), DoctorController.addDoctor)
router.get("/admin/activedoctor/(:id)", DoctorController.activeDoctor);
router.get("/admin/deactivedoctor/:id", DoctorController.deActiveDoctor);

//Blog Router
router.get('/admin/blog', AdminController.adminAuth, AdminController.blog);
router.post('/admin/addblog', upload.single('image'), AdminController.Addpost)
router.get("/admin/activeblog/(:id)", AdminController.activeBlog);
router.get("/admin/deactiveblog/(:id)", AdminController.deActiveBlog);

//Appointment
router.get('/admin/appointment', AdminController.adminAuth, AdminController.AdminAppointment)
router.get('/admin/remove-appointment/(:id)', AdminController.DeleteAppointment)

//Category
router.get('/admin/category', AdminController.Category)
router.post('/admin/addcategory', upload.single('image'), AdminController.addCategory);
router.get("/admin/activeCategory/:id", AdminController.activeCategory);
router.get("/admin/deactiveCategory/:id", AdminController.deActiveCategory);

// Comment 
router.get('/admin/comment',AdminController.CommentData);
router.get('/admin/activeComment/:id', AdminController.activeUComment);
router.get('/admin/deactiveComment/:id',AdminController.deActiveComment);
router.get('/admin/delComment/:id',AdminController.deleteComment);

//Contact 
router.get('/admin/cotact',AdminController.AdminContact);

module.exports = router;
