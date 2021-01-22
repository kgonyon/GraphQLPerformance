const fastify = require("fastify");
const { makeExecutableSchema } = require("graphql-tools");
const { loadFilesSync } = require("graphql-tools");
const path = require("path");
const { getGraphQLParameters, processRequest } = require("graphql-helix");

async function start() {
  const server = fastify();
  server.route({
    url: "/",
    method: "POST",
    handler: await handleGraphql()
  })

  server.listen({ port: 4000 })
  console.log("Started server at localhost:4000")
}

async function handleGraphql() {
  const schema = createSchema();
  return async (request, reply) => {
    const { query, variables, operationName } = getGraphQLParameters(request);
    const result = await processRequest({
      schema,
      request,
      query,
      variables,
      operationName
    });
    reply.headers(result.headers);
    reply.status(result.status);
    return result.payload;
  }
}


function createSchema() {
  const typeDefs = loadFilesSync(path.join(__dirname, "./**/*.graphql"), {
    recursive: true,
  });
  const resolvers = loadFilesSync (
    path.join(__dirname, "./**/resolvers.*(js|ts)"),
    {
      recursive: true,
      exportNames: ["resolvers"],
    }
  );
  return makeExecutableSchema({
    typeDefs,
    resolvers
  })
}

start();