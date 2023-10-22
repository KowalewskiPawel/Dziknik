import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import { pool } from "./database";
import { bodySanitizer } from "./middlewares";
import { usersRouter } from "./routes";
import { swaggerDocs } from "./swagger";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());

app.use(bodySanitizer);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/users", usersRouter);

app.get("/", async (req, res) => {
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
