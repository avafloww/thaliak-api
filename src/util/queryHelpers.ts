import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { ClassType } from 'type-graphql';
import { UserInputError } from 'apollo-server-express';

export function genOptsFromQuery<T>(type: T, requireArgs: boolean, where: { [key: string]: any }): FindManyOptions<ClassType<T>> {
  let relations: string[] = [];
  let seenArgs = 0;
  for (const key in where) {
    if (where[key] === null || where[key] === undefined) {
      delete where[key];
      continue;
    }

    if (typeof where[key] === 'object') {
      if (!relations.includes(key)) {
        relations.push(key);
      }
    }
    seenArgs++;
  }

  if (requireArgs && seenArgs < 1) {
    throw new UserInputError('At least one argument is required');
  }

  const result: FindManyOptions<T> = {
    where: where as FindOptionsWhere<T>,
  };

  if (relations.length) {
    result.relations = relations;
  }

  return result;
}
