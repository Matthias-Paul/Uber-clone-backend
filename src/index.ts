import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import connectDatabase from "./config/database";   
import authRoute from "./routes/authRoute/auth.route";




dotenv.config();       
   
connectDatabase();
const app: Express = express();
const port = process.env.PORT || 6000;

app.use(cors());
app.use(express.json()); 

app.use("/api", authRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
