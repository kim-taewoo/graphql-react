import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up(); // migration 이 변경 때마다 서버 재가동
  // const post = orm.em.create(Post, {title: '첫번째 게시물'});
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {})
  // console.log(posts)

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({em:orm.em})
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('서버 시작 localhost:4000');
  });
};

main().catch((e) => console.error(e));
