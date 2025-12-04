import { Task } from "../models/task.model.js";
import mongoose from "mongoose";

export const createTask = async (req, res) => {

    try {
        const {title,
          description,
          priority,
          dueDate,
          status,
          tags,
          subTasks} = req.body;
        if(!title || !dueDate || !priority || !status){
            return res.status(400).json({success:false,message:"Missing Details"});
        }
        console.log(req.userId);
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            tags, subTasks,
            userId:req.userId
        })
        await task.save();
        
        console.log(task);
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {

        console.log("Create Task Error");
        return res.status(500).json({
            success: false,
            message: error.message
        }); 
    }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      priority,
      dueDate,
      status,
      tags,
      subTasks,
    } = req.body;

    // VALIDATION
    if (!title || !priority || !dueDate || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // FIND TASK BELONGING TO LOGGED-IN USER
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found or unauthorized" });
    }

    // UPDATE FIELDS
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.dueDate = dueDate;
    task.status = status;
    task.tags = tags || [];
    task.subTasks = subTasks || [];

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.log("Update Task Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;

        // 1. Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Task ID"
            });
        }

        // 2. Find task
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // 3. Check ownership
        if (task.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. You cannot delete this task."
            });
        }

        // 4. Delete task
        await Task.findByIdAndDelete(taskId);

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }); 
    }
};

export const getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find({userId:req.userId});

        if(!tasks){
            return res.status(404).json({success:false,message:"No task available"});
        }
        return res.status(200).json({success:true,tasks});

    } catch (error) {
        console.log("get all Task Error");
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({_id:req.params.id,userId:req.userId});
        if(!task){
            return res.status(404).json({success:false,message:"Task not Found"});
        }
        res.status(200).json({success:true,task});
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });         
    }
};