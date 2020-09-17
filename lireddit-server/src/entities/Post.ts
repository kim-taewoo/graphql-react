import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql';

// ObjectType, Field 를 사용해서 graphql 이 type 로 사용할 수 있도록 변형해준다.

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  // @Field() @Field 데코레이터를 붙이지 않으면 graphql 쿼리를 통해(스키마를 통해) 접근할 수 없게 된다.
  // 즉, 데이터베이스에는 존재하지만, graphql 으로 접근할 수 없도록 숨길 수 있다.
  @Field()
  @Property({ type: 'text' })
  title!: string;
}