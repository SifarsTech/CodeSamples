import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { TodoResolver } from "./resolvers/todo";

const main = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TodoResolver],
    }),
  });
  const port = 8002;
  const { url } = await startStandaloneServer(server, {
    listen: {
      port,
    },
  });
  console.log(`Server started successfully on port ${port}`);
};

main();
