import express from 'express';
import { User } from '../models/User';

export const authRouter = express.Router();

// /api/auth
// Authenticate user for login
authRouter.post('/', async (req, res) => {

});
