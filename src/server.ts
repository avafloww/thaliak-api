import 'reflect-metadata';
import 'dotenv/config';
import { useContainer, DataSource } from 'typeorm';
import { File } from './models/file';
import { Patch } from './models/patch';
import { PatchChain } from './models/patchChain';
import { Repository } from './models/repository';
import { Version } from './models/version';
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
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

  // build graphql schema
  const schema = await buildSchema({
    container: Container,
    resolvers: [
      FileResolver,
      PatchResolver,
      PatchChainResolver,
      RepositoryResolver,
      VersionResolver
    ]
  });

  // init apollo
  const port = parseInt(process.env.PORT ?? '4000');
  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  });

  await server.listen({ port });
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

bootstrap();