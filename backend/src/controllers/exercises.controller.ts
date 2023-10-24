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

  async addExercise(req: RequestWithUser, res: Response) {
    const { name, description, length, video_url, is_public } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO exercises (name, description, length, video_url, is_public, author_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, description, length, video_url, is_public, req.userId]
      );

      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async userExercises(req: RequestWithUser, res: Response) {
    try {
      const result = await pool.query(
        "SELECT * FROM exercises WHERE author_id = $1",
        [req.userId]
      );
      res.status(200).json(result.rows);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async getExerciseById(req: RequestWithUser, res: Response) {
    const { exerciseId } = req.params;

    try {
      const result = await pool.query('SELECT * FROM exercises WHERE exercise_id = $1', [exerciseId]);
      const exercise = result.rows[0];

      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      if (exercise.author_id !== req.userId && !exercise.is_public) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.status(200).json(exercise);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async updateExercise(req: RequestWithUser, res: Response) {
    const { exerciseId } = req.params;
    const { name, description, length, video_url, is_public } = req.body;

    try {
      const exercise = await pool.query('SELECT * FROM exercises WHERE exercise_id = $1', [exerciseId]);

      if (!exercise.rows.length) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      if (exercise.rows[0].author_id !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const result = await pool.query(
        'UPDATE exercises SET name = $1, description = $2, length = $3, video_url = $4, is_public = $5 WHERE exercise_id = $6 RETURNING *',
        [name, description, length, video_url, is_public, exerciseId]
      );

      res.status(200).json(result.rows[0]);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async deleteExercise(req: RequestWithUser, res: Response) {
    const { exerciseId } = req.params;

    try {
      const exercise = await pool.query('SELECT * FROM exercises WHERE exercise_id = $1', [exerciseId]);

      if (!exercise.rows.length) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      if (exercise.rows[0].author_id !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await pool.query('DELETE FROM exercises WHERE exercise_id = $1', [exerciseId]);
      res.status(204).json({ message: 'Exercise deleted successfully' });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
}
