import { Router } from "express";
import { UsersController } from "../controllers";

const usersController = new UsersController();

export const usersRouter = Router()
  .post("/signup", usersController.signup)
  .post("/login", usersController.login);
