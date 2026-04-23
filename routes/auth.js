const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User = require("../model/user");


router.post("/register",async (req,res)=>{
    try{
        const {name, email, password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message:"Please Provide all the details"
            });
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message:"User already exists",
            });
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPass=await bcrypt.hash(password,salt);

        const newUser=new User({
            name:name,
            email:email,
            password:hashedPass,
        });

        await newUser.save();

        res.status(201).json({
            message:"User registered successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            message:"Failed to create new User",
            err:error.message,
        });
    }
});

router.post("/login", async(req,res)=>{
    try{const {email, password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Please provide the credentials"
            });
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(401).json({
                message:"Invalid email or password",
            });
        }

        const isCorrect=await bcrypt.compare(password,user.password);

        if(!isCorrect){
            return res.status(401).json({
                message:"Incorrect email or password",
            });
        }
        const token=jwt.sign({userId:user._id, email:user.email},process.env.JWT_SECRET,{expiresIn:"1D"});
        res.json({
            message:"Login Successfull",
            token:token,
        });
    }
    catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
});

module.exports=router
