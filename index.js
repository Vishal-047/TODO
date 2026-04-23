const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
require("dotenv").config();

const authRoute=require("./routes/auth");
const todoRoute=require("./routes/todo");
const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Database connected"))
.catch((err)=>console.log(err));

app.use("/auth", authRoute);
app.use("/todos", todoRoute);

app.use((req,res)=>{
    res.status(404).json({
        message:"Routes not found",
    });
});

const PORT=process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log("server started at port: ",PORT);
});
