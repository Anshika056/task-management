import { Response } from 'express';
import Task from '../models/task.model';
import mongoose from "mongoose";
import { AuthenticatedRequest, TaskRequestBody } from '../types/type';
import ResponseHelper from "../helpers/responseHelpher";

//validation guards
const isTaskRequestBody = (body: any):body is TaskRequestBody => {
  const allowedFields = ['title', 'description'];
  const bodyKeys = Object.keys(body);

  for (const key of bodyKeys) {
    if (!allowedFields.includes(key)) {
      return false;
    }
  }

  return true;
};

// Add Task
export const addTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description }: TaskRequestBody = req.body;
    if (!isTaskRequestBody(req.body)) {
      return ResponseHelper.response({
        res,
        code: 404,
        success: false,
        message: "Invalid request body. Only title and description fields are allowed.",
        data: {},
    })
    }
    const newTask = new Task({
         title, description, ownerId: req.user!.id , author: req.user?.username 
        });
    const savedTask = await newTask.save();
    return ResponseHelper.response({
      res,
      code: 201,
      success: true,
      message: "Task created successfully!",
      data: savedTask,
  });
  } catch (error) {
   return ResponseHelper.error({ res, err: error });
  }
};

// Get Tasks
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userRole = req.user!.role;
      const userId = req.user!.id;
  
      let tasks = [];
      if (userRole === 'admin') {
        tasks = await Task.find();
      } else {
        tasks = await Task.find({ ownerId: userId });
      }
      return ResponseHelper.response({
        res,
        code: 201,
        success: true,
        message: "Tasks Fetched Successfully.",
        data: tasks
    })
    } catch (error) {
     return ResponseHelper.error({ res, err: error });
    }
  };

// Update Task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid taskId' });
    }

    const { title, description }: TaskRequestBody = req.body;
    if (!isTaskRequestBody(req.body)) {
      return ResponseHelper.response({
        res,
        code: 400,
        success: false,
        message: "Invalid request body. Only title and description fields are allowed.",
        data: {}
    })
    }
    const userRole = req.user!.role;
    const userId = req.user!.id;
    
    if (!userId) {
      return ResponseHelper.response({
        res,
        code: 401,
        success: false,
        message: "User ID not found in request",
        data: {}
    })
    }
    let task = await Task.findById(taskId);

    if (!task) {
      return ResponseHelper.response({
        res,
        code: 401,
        success: false,
        message: "Task not found",
        data: {}
    })
    }

    if (task.ownerId.toString() !== userId.toString() && userRole !== 'admin') {
      return ResponseHelper.response({
        res,
        code: 403,
        success: false,
        message: "Not authorized",
        data: {}
    })
    }
    const updateFields: Partial<TaskRequestBody> = {};
    if (title !== undefined) {
      updateFields.title = title;
    }
    if (description !== undefined) {
      updateFields.description = description;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      { $set: updateFields },
      { new: true }
    );

    return ResponseHelper.response({
      res,
      code: 201,
      success: true,
      message: "Task update successfully",
      data: updatedTask
  })
  } catch (error) {
    console.log(error)
   return ResponseHelper.error({ res, err: error });
  }
};

// Delete Task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userRole = req.user!.role;
    const userId = req.user!.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return ResponseHelper.response({
        res,
        code: 404,
        success: false,
        message: "Task update successfully",
        data: {}
    })
    }

    if (task.ownerId.toString() !== userId.toString() && userRole !== 'admin') {
      return ResponseHelper.response({
        res,
        code: 401,
        success: false,
        message: "Not authorized",
        data: {}
    })
    }

    await task.deleteOne({_id:taskId});
    return ResponseHelper.response({
      res,
      code: 201,
      success: true,
      message: "Task deleted successfully",
      data: {}
  })
  } catch (error) {
    return ResponseHelper.error({ res, err: error });
  }
};
