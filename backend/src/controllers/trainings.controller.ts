import { pool } from "../database";
import type { Request, Response, RequestWithUser } from "../types";

export class TrainingPlansController {
  async createTrainingPlan(req: RequestWithUser, res: Response) {
    try {
      // Extracting data from the request body
      const { name, description, is_public } = req.body;

      // Ensure all required fields are provided
      if (!name || !description) {
        return res.status(400).json({
          error: true,
          message: "Name and description are required fields.",
        });
      }

      // Inserting the new training plan into the database
      const result = await pool.query(
        "INSERT INTO training_plans (name, description, is_public, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, description, is_public, req.userId]
      );

      // Sending back the created training plan
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async getPublicTrainingPlans(_req: Request, res: Response) {
    try {
      // Query the database for all public training plans
      const plansResult = await pool.query(
        "SELECT * FROM training_plans WHERE is_public = true"
      );

      const plans = plansResult.rows;

      // For each training plan, fetch its exercises
      for (let i = 0; i < plans.length; i++) {
        const exercisesResult = await pool.query(
          `SELECT e.* 
           FROM exercises e
           JOIN training_plan_exercises tpe ON e.exercise_id = tpe.exercise_id
           WHERE tpe.plan_id = $1`,
          [plans[i].plan_id]
        );

        plans[i].exercises = exercisesResult.rows;
      }

      // Return the fetched training plans with their exercises
      res.status(200).json(plans);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async getUserTrainingPlans(req: RequestWithUser, res: Response) {
    try {
      // Get the user ID from the request object (populated by the JWT middleware)
      const userId = req.userId;

      // Query the database for all training plans created by the authenticated user
      const plansResult = await pool.query(
        "SELECT * FROM training_plans WHERE author_id = $1",
        [userId]
      );

      const plans = plansResult.rows;

      // For each training plan, fetch its exercises
      for (let i = 0; i < plans.length; i++) {
        const exercisesResult = await pool.query(
          `SELECT e.* 
           FROM exercises e
           JOIN training_plan_exercises tpe ON e.exercise_id = tpe.exercise_id
           WHERE tpe.plan_id = $1`,
          [plans[i].plan_id]
        );

        plans[i].exercises = exercisesResult.rows;
      }

      // Return the fetched training plans with their exercises
      res.status(200).json(plans);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async getTrainingPlanById(req: RequestWithUser, res: Response) {
    const { planId } = req.params;

    try {
      // Fetch the training plan by ID
      const planResult = await pool.query(
        "SELECT * FROM training_plans WHERE plan_id = $1",
        [planId]
      );

      const plan = planResult.rows[0];

      // If the plan doesn't exist
      if (!plan) {
        return res.status(404).json({ message: "Training plan not found." });
      }

      // If the plan is not public and doesn't belong to the user
      if (!plan.is_public && plan.author_id !== req.userId) {
        return res.status(403).json({ message: "Access denied." });
      }

      // Fetch the exercises associated with the training plan
      const exercisesResult = await pool.query(
        `SELECT e.* 
             FROM exercises e
             JOIN training_plan_exercises tpe ON e.exercise_id = tpe.exercise_id
             WHERE tpe.plan_id = $1`,
        [planId]
      );

      // Add the exercises to the plan object
      plan.exercises = exercisesResult.rows;

      // Return the fetched training plan with its exercises
      res.status(200).json(plan);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async updateTrainingPlan(req: RequestWithUser, res: Response) {
    const { planId } = req.params;
    const { name, description, is_public } = req.body;

    try {
      // First, check if the plan exists and belongs to the user
      const plan = await pool.query(
        "SELECT * FROM training_plans WHERE plan_id = $1",
        [planId]
      );

      if (plan.rows.length === 0) {
        return res.status(404).json({ message: "Training plan not found." });
      }

      if (plan.rows[0].author_id !== req.userId) {
        return res.status(403).json({
          message: "You are not authorized to update this training plan.",
        });
      }

      // Update the training plan
      const updatedPlan = await pool.query(
        "UPDATE training_plans SET name = $1, description = $2, is_public = $3 WHERE plan_id = $4 RETURNING *",
        [name, description, is_public, planId]
      );

      res.status(200).json(updatedPlan.rows[0]);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async deleteTrainingPlan(req: RequestWithUser, res: Response) {
    const { planId } = req.params;

    try {
      // First, check if the training plan exists and belongs to the user
      const planResult = await pool.query(
        "SELECT * FROM training_plans WHERE plan_id = $1 AND author_id = $2",
        [planId, req.userId]
      );

      if (planResult.rows.length === 0) {
        return res.status(404).json({
          message:
            "Training plan not found or you're not authorized to delete it.",
        });
      }

      // Delete the training plan
      await pool.query("DELETE FROM training_plans WHERE plan_id = $1", [
        planId,
      ]);

      res.status(200).json({ message: "Training plan deleted successfully." });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async addExerciseToPlan(req: RequestWithUser, res: Response) {
    try {
      const { planId } = req.params;
      const { exerciseId } = req.body;

      // Check if the user is the author of the training plan
      const plan = await pool.query(
        "SELECT * FROM training_plans WHERE plan_id = $1 AND author_id = $2",
        [planId, req.userId]
      );
      if (plan.rows.length === 0) {
        return res
          .status(403)
          .json("You do not have permission to modify this training plan.");
      }

      // Check if the exercise is already part of the training plan
      const existingExercise = await pool.query(
        "SELECT * FROM training_plan_exercises WHERE plan_id = $1 AND exercise_id = $2",
        [planId, exerciseId]
      );
      if (existingExercise.rows.length > 0) {
        return res
          .status(400)
          .json("This exercise is already part of the training plan.");
      }

      // Add the exercise to the training plan
      await pool.query(
        "INSERT INTO training_plan_exercises (plan_id, exercise_id) VALUES ($1, $2)",
        [planId, exerciseId]
      );

      res
        .status(201)
        .json({ message: "Exercise added to training plan successfully." });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async removeExerciseFromPlan(req: RequestWithUser, res: Response) {
    const { planId, exerciseId } = req.params;

    try {
      // First, check if the plan belongs to the user
      const plan = await pool.query(
        "SELECT * FROM training_plans WHERE plan_id = $1",
        [planId]
      );

      if (plan.rows.length === 0) {
        return res.status(404).json({ message: "Training plan not found." });
      }

      if (plan.rows[0].author_id !== req.userId) {
        return res
          .status(403)
          .json({
            message: "You are not authorized to modify this training plan.",
          });
      }

      // Remove the exercise from the training plan
      await pool.query(
        "DELETE FROM training_plan_exercises WHERE plan_id = $1 AND exercise_id = $2",
        [planId, exerciseId]
      );

      res
        .status(204)
        .json({
          message: "Exercise removed from the training plan successfully.",
        });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
}
