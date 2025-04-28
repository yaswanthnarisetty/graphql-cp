import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import mongoose from "mongoose";
import createApolloGraphqlServer from "./graphql";

dotenv.config();

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 4000;
  const MONGO_URI =
    (process.env.MONGO_URI as string) || "mongodb://localhost:27017/cp-back";

  app.use(express.json());

  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Mongodb connected"))
    .catch((err) => console.log(err));

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(await createApolloGraphqlServer()));

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
