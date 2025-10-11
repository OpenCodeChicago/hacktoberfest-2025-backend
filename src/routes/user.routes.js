
import express from 'express';
import {userLogin, userSignUp} from '../Controllers/user.controller.js';
const router = express.Router();


router.post('/login',userLogin);
router.post('/signup',userSignUp);

export default router