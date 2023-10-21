import { Router } from "express";
import { UsersController } from "../controllers";

const usersController = new UsersController();

export const usersRouter = Router();

usersRouter.post("/signup", usersController.signup);
