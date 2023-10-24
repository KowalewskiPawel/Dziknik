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
  .get("/all", authJWT, exercisesController.publicExercises)
  /**
   * @swagger
   * /exercises/user:
   *   get:
   *     summary: Retrieve exercises created by the authenticated user
   *     tags: [Exercises]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully retrieved user's exercises.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Exercise'
   *       500:
   *         description: Server error.
   */
  .get("/user", authJWT, exercisesController.userExercises)
  /**
   * @swagger
   * /exercises/new:
   *   post:
   *     summary: Add a new exercise
   *     tags: [Exercises]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the exercise.
   *               description:
   *                 type: string
   *                 description: A brief description of the exercise.
   *               length:
   *                 type: string
   *                 description: The length or duration of the exercise, e.g., "4 sets x 10 reps".
   *               video_url:
   *                 type: string
   *                 description: An optional URL to a video demonstrating the exercise.
   *               is_public:
   *                 type: boolean
   *                 description: Indicates if the exercise is publicly accessible.
   *             required:
   *               - name
   *               - description
   *               - length
   *               - is_public
   *     responses:
   *       201:
   *         description: Successfully added a new exercise.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercise'
   *       500:
   *         description: Server error.
   */
  .post("/new", authJWT, exercisesController.addExercise)
  /**
   * @swagger
   * /exercises/{exerciseId}:
   *   get:
   *     tags:
   *       - Exercises
   *     description: Get a specific exercise by its ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: exerciseId
   *         required: true
   *         description: ID of the exercise to retrieve
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Exercise retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercise'
   *       403:
   *         description: Access denied
   *       404:
   *         description: Exercise not found
   *       500:
   *         description: Server error
   *
   *   put:
   *     tags:
   *       - Exercises
   *     description: Update a specific exercise by its ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: exerciseId
   *         required: true
   *         description: ID of the exercise to update
   *         schema:
   *           type: integer
   *     requestBody:
   *       description: Updated exercise data
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the exercise.
   *               description:
   *                 type: string
   *                 description: A brief description of the exercise.
   *               length:
   *                 type: string
   *                 description: The length or duration of the exercise, e.g., "4 sets x 10 reps".
   *               video_url:
   *                 type: string
   *                 description: An optional URL to a video demonstrating the exercise.
   *               is_public:
   *                 type: boolean
   *                 description: Indicates if the exercise is publicly accessible.
   *             required:
   *               - name
   *               - description
   *               - length
   *               - is_public
   *     responses:
   *       200:
   *         description: Exercise updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercise'
   *       403:
   *         description: Access denied
   *       404:
   *         description: Exercise not found
   *       500:
   *         description: Server error
   *
   *   delete:
   *     tags:
   *       - Exercises
   *     description: Delete a specific exercise by its ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: exerciseId
   *         required: true
   *         description: ID of the exercise to delete
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Exercise deleted successfully
   *       403:
   *         description: Access denied
   *       404:
   *         description: Exercise not found
   *       500:
   *         description: Server error
   */
  .get("/:exerciseId", authJWT, exercisesController.getExerciseById)
  .put("/:exerciseId", authJWT, exercisesController.updateExercise)
  .delete("/:exerciseId", authJWT, exercisesController.deleteExercise);
