import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
