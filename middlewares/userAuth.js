const jwt=require('jsonwebtoken');

exports.authjwt=(req,res,next)=>{
    if(req.cookies && req.cookies.token){
        jwt.verify(req.cookies.token ,'sdsubhajit@2406',(err,data)=>{
            req.user=data,
            next();
        })
    }else{
        next()
    }
}