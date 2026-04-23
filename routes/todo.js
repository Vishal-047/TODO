const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const Todo=require("../model/todo");
const auth=require("../middleware/auth");

router.use(auth);

router.get("/", async(req,res)=>{
    try {const todos=await Todo.find({user:req.user.userId});
        res.json(todos);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

router.post("/", async(req,res)=>{
    try{
        const title=req.body?.title?.trim();

        if(!title){
            return res.status(400).json({
                message:"Please provide the title",
            });
        }

        const newTodo=new Todo({
            title:title,
            user:req.user.userId
        });
        await newTodo.save();

        res.status(201).json({
            message:"Todo was saved successfully",
            todo:newTodo
        });
    }
    catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
});

router.put("/:id", async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid todo id",
            });
        }

        const todo=await Todo.findOne({
            _id:req.params.id,
            user: req.user.userId,
        });
        if(!todo){
            return res.status(404).json({
                message:"Todo not found",
            });
        }
        todo.completed = !todo.completed;
        await todo.save();

        res.json({
            message:`Todo marked as ${todo.completed ? "complete" : "incomplete"}!`,
            todo:todo,
        });
    }
    catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
});

router.delete("/:id", async (req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid todo id",
            });
        }

        const todo= await Todo.findOneAndDelete({
            _id:req.params.id,
            user:req.user.userId,
        });

        if(!todo){
            return res.status(404).json({
                message:"Todo not found",
            });
        }

        res.json({
            message:"Todo deleted Successfully",
            todo:todo,
        });
    }
    catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
});

module.exports=router;
