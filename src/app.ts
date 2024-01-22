import express from 'express';
import authRoutes from "./routes/authRoutes";
import rnmRoutes from "./routes/rnmRoutes";
import userRoutes from "./routes/userRoutes";
import authenticateToken from "./utils/middlewares";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app: express.Application = express();

app.use(express.json());

app.use(cors());
app.use(authenticateToken);
app.use(authRoutes, rnmRoutes, userRoutes);

export default app;
