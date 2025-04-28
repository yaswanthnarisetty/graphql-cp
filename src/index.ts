import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 4000;
  const MONGO_URI = process.env.MONGO_URI as string||"mongodb://localhost:27017/cp-back"

  app.use(express.json());

  mongoose.connect(MONGO_URI).then(() => console.log("Mongodb connected")).catch((err) => console.log(err));

  // Create Graphql Server
  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
    `, // Schema
    resolvers: {
      Query: {
        hello: () => `Hey there, I am a graphql server`,
        say: (_, { name }: { name: string }) => `Hey ${name}, How are you?`,
      },
    },
  });

  // Start the gql server
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
