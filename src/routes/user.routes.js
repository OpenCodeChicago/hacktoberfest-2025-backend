import express from 'express';
import { createUser,getUserById,login,logout } from '../controllers/user.controller.js';
import { auth } from '../middleware/user-auth.middleware.js';

const router = express.Router();

// Fetch all products
router.get('/userId/:userId',getUserById );
router.post('/login',login);
router.post('/logout',auth,logout);
router.post('/register-user',createUser);

export default router
