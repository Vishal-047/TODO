const jwt=require("jsonwebtoken");

const auth=(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message:"Please login first"
        });
    };

    const token=authHeader.split(" ")[1];

    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"Invalid! Please login again"
        });
    }
}

module.exports=auth;
