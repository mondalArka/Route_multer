const express = require('express');
const mongoose = require('mongoose');
const body_parser=require('body-parser')
const cookie=require('cookie-parser')
const session=require('express-session')
const flash = require('connect-flash')
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 9020;

app.use(express.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(cookie())
app.use(flash())
app.use(session({
    cookie: {
        maxAge: 60000
    },
    secret: "nishant@8818",
    resave: false,
    saveUninitialized: false
}));



app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

const userAuth = require('./middlewares/userAuth')
app.use(userAuth.authjwt)

const UserRoute = require('./routes/UserRoute');
app.use(UserRoute);


const adminAuth=require('./middlewares/adminAuth')
app.use(adminAuth.authJwt);



const AdminRoute=require("./routes/AdminRoute")
app.use(AdminRoute)

const dbCon = "mongodb+srv://nodeClass:LMoQihMaJfCIw0pQ@cluster0.vimfle7.mongodb.net/Medical";
mongoose.connect(dbCon, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(port, () => {
            console.log(`server running http://localhost:${port}`);
            console.log(`Connected`);
        })
    }).catch(err => {
        console.log(err);
    })