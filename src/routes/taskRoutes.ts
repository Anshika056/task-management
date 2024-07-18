import { Router } from "express";
const router = Router();

import { addTask, getTasks,updateTask,deleteTask } from "../controllers/task.controllers";
import authMiddleware from "../middleware/auth.middleware";

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, addTask);
router.put('/:taskId', authMiddleware, updateTask);
router.delete('/:taskId', authMiddleware, deleteTask);
export default router;