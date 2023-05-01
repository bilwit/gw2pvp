import express from 'express';
import { User } from '../models/User';
// import { validateJwt } from '../services/validateJwt';

export const userRouter = express.Router();

// /api/user
userRouter.get('/', async (req, res) => {
  console.log('here');
  console.log(req.auth.payload);
});
