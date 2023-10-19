import { FieldResolver, Query, Resolver, Root } from "type-graphql";
import { users } from "../constants";
import { Todo } from "../entities/Todo";
import { User } from "../entities/User";

@Resolver(Todo)
export class TodoResolver {
  @Query(() => [Todo])
  async todos() {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await res.json();
    return data;
  }

  @FieldResolver(() => User)
  async user(@Root() todo: Todo) {
    return users.find((user) => user.id === todo.userId);
  }
}
