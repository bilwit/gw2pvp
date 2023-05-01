import express from 'express';
import { User } from '../models/User';
// import { validateJwt } from '../services/validateJwt';

export const userRouter = express.Router();

// /api/user
userRouter.post('/', async (req, res) => {
  console.log(req.auth.payload);
});
