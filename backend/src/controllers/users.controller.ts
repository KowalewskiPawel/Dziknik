import { Request, Response } from "express";
import Joi from "joi";
import { hashPassword } from "../utils";
import { pool } from "../database";

const userSchema = Joi.object().keys({
  username: Joi.string().required().min(4),
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export class UsersController {
  async signup(req: Request, res: Response) {
    try {
      // validate body
      const result = userSchema.validate(req.body);
      if (result.error) {
        console.log(result.error.message);
        return res.status(400).json({
          error: true,
          status: 400,
          message: result.error.message,
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
