import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { pool } from "./database";
import { bodySanitizer } from "./middlewares";
import { usersRouter } from "./routes";
import { swaggerDocs } from "./swagger";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(cors())
  .use(helmet())
  .use(bodySanitizer)
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  .use("/users", usersRouter);

app.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
