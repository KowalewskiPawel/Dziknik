import { Request, Response } from "express";
import { hashPassword, validateUser } from "../utils";
import { pool } from "../database";

export class UsersController {
  async signup(req: Request, res: Response) {
    try {
      // validate body
      const validationError = validateUser(req.body);

      if (validationError) {
        return res.status(400).json({
          error: true,
          status: 400,
          message: validationError,
        });
      }

      const { username, password, email } = req.body;

      // hash password
      const hashedPassword = await hashPassword(password);

      // Store user in the database
      const newUser = await pool.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, email]
      );

      res.status(201).json(newUser.rows[0]);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
}
