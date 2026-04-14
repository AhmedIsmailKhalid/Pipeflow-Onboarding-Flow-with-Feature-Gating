import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.getUser(req.user!.userId)
    res.json(user)
  } catch (err) {
    next(err)
  }
}