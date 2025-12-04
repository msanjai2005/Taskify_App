import express from 'express';
import { createTask, deleteTask, getAllTask, getTask, updateTask } from '../controller/task.controller.js';
import { VerifyToken } from '../middleware/VerifyToken.middleware.js';

const router = express.Router();

router.get('/tasks/:id', VerifyToken, getTask);
router.get('/tasks', VerifyToken, getAllTask);

router.post('/tasks', VerifyToken, createTask);
router.put('/tasks/:id', VerifyToken, updateTask);
router.delete('/tasks/:id', VerifyToken, deleteTask);

export default router;

