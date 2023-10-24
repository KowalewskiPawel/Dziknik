import { Router } from "express";
import { UsersController } from "../controllers";
import { authJWT } from "../middlewares/validateJWT";

const usersController = new UsersController();

export const usersRouter = Router()
  /**
   * @swagger
   * /users/signup:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
  .post("/signup", usersController.signup)
  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Login a user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Server error
   */
  .post("/login", usersController.login)
  /**
   * @swagger
   * /users/test:
   *   get:
   *     summary: Test protected route
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User is logged in
   *       500:
   *         description: Server error
   */
  .get("/test", authJWT, usersController.protected);
