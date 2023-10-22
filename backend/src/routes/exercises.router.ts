import { Router } from "express";
import { ExercisesController } from "../controllers";
import { authJWT } from "../middlewares/validateJWT";

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         exercise_id:
 *           type: integer
 *           description: The ID of the exercise.
 *         name:
 *           type: string
 *           description: The name of the exercise.
 *         description:
 *           type: string
 *           description: A brief description of the exercise.
 *         length:
 *           type: string
 *           description: The length or duration of the exercise, e.g., "4 sets x 10 reps".
 *         video_url:
 *           type: string
 *           nullable: true
 *           description: An optional URL to a video demonstrating the exercise.
 *         is_public:
 *           type: boolean
 *           description: Indicates if the exercise is publicly accessible.
 *         author_id:
 *           type: integer
 *           description: The ID of the user who created the exercise.
 *       required:
 *         - exercise_id
 *         - name
 *         - description
 *         - length
 *         - is_public
 *         - author_id
 */

const exercisesController = new ExercisesController();

export const exercisesRouter = Router()
  /**
   * @swagger
   * /exercises/all:
   *   get:
   *     tags:
   *       - Exercises
   *     summary: Retrieve all public exercises
   *     description: Fetches all exercises that have been marked as public.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of public exercises.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Exercise'
   *       500:
   *         description: Server error
   */
  .get("/all", authJWT, exercisesController.publicExercises);
