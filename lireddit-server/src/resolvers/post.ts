import { Post } from '../entities/Post';
import { MyContext } from '../types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

// @Query() 는 조회를 위한 것, @Mutation() 은 생성, 업데이트 등을 위한 것이다.

@Resolver()
export class PostResolver {
  @Query(() => [Post]) //graphql type
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    // typescript type
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true }) //graphql type. {nullable:true} 는 null 값을 리턴할 수 있음을 나타낸다.
  post(
    // 'id' 는 그냥 graphql 쿼리상 사용하기 위한 문자열일뿐,
    // 아래 코드 작성시 사용하게 될 것은 typescript type 에 적혀있는 변수다.(여기선 id)
    @Arg('id') id: number, // 괄호 안이 graphql type, 괄호 밖이 typescript type
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    // typescript type
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
