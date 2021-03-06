import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
const HOST: string = process.env.HOST || "localhost";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const options: cors.CorsOptions = {
  origin: true,
  credentials: true,
  methods: "GET,PUT,PATCH,POST,DELETE",
};
app.use(cors(options));
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello world");
});

app.listen(PORT, async () => {
  console.log(`Server Listening on ${PORT}`);
});
