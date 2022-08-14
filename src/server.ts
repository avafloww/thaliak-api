import 'reflect-metadata';
import 'dotenv/config';
import http from 'http';
import express from 'express';
import { useContainer, DataSource } from 'typeorm';
import { File } from './models/file';
import { Patch } from './models/patch';
import { PatchChain } from './models/patchChain';
import { Repository } from './models/repository';
import { Version } from './models/version';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import { PatchResolver } from './resolvers/patch';
import { PatchChainResolver } from './resolvers/patchChain';
import { FileResolver } from './resolvers/file';
import { RepositoryResolver } from './resolvers/repository';
import { VersionResolver } from './resolvers/version';
import { Container } from 'typedi';

export const db = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'thaliak',
  entities: [
    File,
    Patch,
    PatchChain,
    Repository,
    Version,
  ],
  synchronize: false,
});

async function bootstrap() {
  // init db
  await db.initialize();

  Container.set(DataSource, db);
  useContainer(Container);

  const schemaFile = __dirname + '/schema.graphql';

  // build graphql schema
  const schema = await buildSchema({
    container: Container,
    resolvers: [
      FileResolver,
      PatchResolver,
      PatchChainResolver,
      RepositoryResolver,
      VersionResolver,
    ],
    emitSchemaFile: schemaFile,
  });

  // init express
  const app = express();

  // statically serve the schema
  const staticSchema = express.static(schemaFile);
  app.use('/schema.graphql', staticSchema);
  app.use('/schema.gql', staticSchema);

  const httpServer = http.createServer(app);

  // init apollo
  const port = parseInt(process.env.PORT ?? '4000');
  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/'
  });

  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

bootstrap();