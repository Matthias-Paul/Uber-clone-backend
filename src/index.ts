import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import connectDatabase from "./config/database";   
dotenv.config();       
   
connectDatabase();
const app: Express = express();
const port = process.env.PORT || 6000;

app.use(cors());
app.use(express.json()); 
     
console.log("Hello")  

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
