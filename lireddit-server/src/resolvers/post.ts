import { Post } from 'src/entities/Post';
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloResolver {
  @Query(() => [Post])
  hello() {
    return 'hello world';
  }
}
