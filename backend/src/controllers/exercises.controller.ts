import { pool } from "../database";
import type { Request, Response, RequestWithUser } from "../types";

export class ExercisesController {
  async publicExercises(_req: Request, res: Response) {
    try {
      const result = await pool.query(
        "SELECT * FROM exercises WHERE is_public = true"
      );
      res.status(200).json(result.rows);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
}
