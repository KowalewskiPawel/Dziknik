import { Router } from "express";
import { TrainingPlansController } from "../controllers";
import { authJWT } from "../middlewares/validateJWT";

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingPlan:
 *       type: object
 *       properties:
 *         plan_id:
 *           type: integer
 *           description: The ID of the training plan.
 *         name:
 *           type: string
 *           description: The name of the training plan.
 *         description:
 *           type: string
 *           description: A brief description of the training plan.
 *         is_public:
 *           type: boolean
 *           description: Indicates if the training plan is publicly accessible.
 *         author_id:
 *           type: integer
 *           description: The ID of the user who created the training plan.
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *           description: A list of exercises associated with the training plan.
 *       required:
 *         - plan_id
 *         - name
 *         - description
 *         - is_public
 *         - author_id
 */

const trainingPlansController = new TrainingPlansController();

export const trainingsRouter = Router()
  /**
   * @swagger
   * /training-plans/new:
   *   post:
   *     summary: Create a new training plan
   *     tags: [Training Plans]
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
   *                 description: The name of the training plan.
   *               description:
   *                 type: string
   *                 description: A brief description of the training plan.
   *               is_public:
   *                 type: boolean
   *                 description: Indicates if the training plan is publicly accessible.
   *             required:
   *               - name
   *               - description
   *               - is_public
   *     responses:
   *       201:
   *         description: Successfully created a new training plan.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TrainingPlan'
   *       400:
   *         description: Bad request. Missing or invalid fields.
   *       500:
   *         description: Server error.
   */
  .post("/new", authJWT, trainingPlansController.createTrainingPlan)
  /**
   * @swagger
   * /training-plans/all:
   *   get:
   *     summary: Retrieve all public training plans
   *     tags: [Training Plans]
   *     responses:
   *       200:
   *         description: Successfully retrieved list of public training plans.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TrainingPlan'
   *       500:
   *         description: Server error.
   */
  .get("/all", trainingPlansController.getPublicTrainingPlans)
  /**
   * @swagger
   * /training-plans/user:
   *   get:
   *     summary: Fetch all training plans created by the authenticated user
   *     tags: [Training Plans]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully fetched user's training plans.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   plan_id:
   *                     type: integer
   *                     description: The ID of the training plan.
   *                   name:
   *                     type: string
   *                     description: The name of the training plan.
   *                   description:
   *                     type: string
   *                     description: A brief description of the training plan.
   *                   is_public:
   *                     type: boolean
   *                     description: Indicates if the training plan is publicly accessible.
   *                   author_id:
   *                     type: integer
   *                     description: The ID of the user who created the training plan.
   *                   exercises:
   *                     type: array
   *                     items:
   *                       $ref: '#/components/schemas/Exercise'
   *       500:
   *         description: Server error.
   */
  .get("/user", authJWT, trainingPlansController.getUserTrainingPlans)
  /**
   * @swagger
   * /training-plans/{planId}:
   *   get:
   *     summary: Get a specific training plan by ID (including its exercises)
   *     tags: [Training Plans]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: planId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the training plan to retrieve
   *     responses:
   *       200:
   *         description: Successfully retrieved the training plan.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 plan_id:
   *                   type: integer
   *                   description: The ID of the training plan.
   *                 name:
   *                   type: string
   *                   description: The name of the training plan.
   *                 description:
   *                   type: string
   *                   description: A brief description of the training plan.
   *                 is_public:
   *                   type: boolean
   *                   description: Indicates if the training plan is publicly accessible.
   *                 author_id:
   *                   type: integer
   *                   description: The ID of the user who created the training plan.
   *                 exercises:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Exercise'
   *       403:
   *         description: Access denied.
   *       404:
   *         description: Training plan not found.
   *       500:
   *         description: Server error.
   */
  .get("/:planId", authJWT, trainingPlansController.getTrainingPlanById)
  /**
   * @swagger
   * /training-plans/{planId}:
   *   put:
   *     summary: Update a training plan
   *     tags: [Training Plans]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: planId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the training plan to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The updated name of the training plan.
   *               description:
   *                 type: string
   *                 description: An updated description of the training plan.
   *               is_public:
   *                 type: boolean
   *                 description: Indicates if the training plan is publicly accessible.
   *             required:
   *               - name
   *               - description
   *               - is_public
   *     responses:
   *       200:
   *         description: Successfully updated the training plan.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TrainingPlan'
   *       403:
   *         description: Not authorized to update the training plan.
   *       404:
   *         description: Training plan not found.
   *       500:
   *         description: Server error.
   */
  .put("/:planId", authJWT, trainingPlansController.updateTrainingPlan)
  /**
   * @swagger
   * /training-plans/{planId}:
   *   delete:
   *     summary: Delete a training plan
   *     tags: [Training Plans]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: planId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the training plan to delete
   *     responses:
   *       200:
   *         description: Successfully deleted the training plan.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       403:
   *         description: Not authorized to delete the training plan.
   *       404:
   *         description: Training plan not found.
   *       500:
   *         description: Server error.
   */
  .delete("/:planId", authJWT, trainingPlansController.deleteTrainingPlan)
  /**
   * @swagger
   * /training-plans/{planId}/exercises:
   *   post:
   *     summary: Add an exercise to a training plan
   *     tags: [Training Plans]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: planId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the training plan to which the exercise will be added
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               exerciseId:
   *                 type: integer
   *                 description: The ID of the exercise to be added to the training plan
   *             required:
   *               - exerciseId
   *     responses:
   *       201:
   *         description: Successfully added the exercise to the training plan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: A success message indicating the exercise was added
   *       400:
   *         description: Bad request (e.g., exercise already part of the training plan)
   *       403:
   *         description: Forbidden (e.g., user does not have permission to modify the training plan)
   *       500:
   *         description: Server error
   */
  .post(
    "/:planId/exercises",
    authJWT,
    trainingPlansController.addExerciseToPlan
  )
  /**
   * @swagger
   * /training-plans/{planId}/exercises/{exerciseId}:
   *   delete:
   *     summary: Remove an exercise from a training plan
   *     tags: [Training Plans]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: planId
   *         required: true
   *         description: Numeric ID of the training plan
   *         schema:
   *           type: integer
   *       - in: path
   *         name: exerciseId
   *         required: true
   *         description: Numeric ID of the exercise to be removed
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Exercise removed from the training plan successfully
   *       403:
   *         description: User is not authorized to modify this training plan
   *       404:
   *         description: Training plan not found
   *       500:
   *         description: Server error
   */
  .delete(
    "/:planId/exercises/:exerciseId",
    authJWT,
    trainingPlansController.removeExerciseFromPlan
  );
