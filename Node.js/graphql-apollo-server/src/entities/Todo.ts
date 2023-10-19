import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Todo {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  userId: number;

  @Field()
  completed: boolean;

  @Field({ nullable: true })
  user: User;
}
