import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
const port = process.env.PORT;
const app = express();
import CONNECT_DB from "./db.js";
const DATABASE_URL = process.env.DATABASE_URL;
import userRoutes from "./routes/userRoute.js";

CONNECT_DB(DATABASE_URL);
//use cors
app.use(cors());

//middleware
app.use(express.json());

//public routes
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`port running on ${port}`);
});
