import express from 'express';
import { pool } from './database';
import cors from "cors";
import helmet from "helmet";
import { bodySanitizer } from './middlewares';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());

app.use(bodySanitizer);

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
