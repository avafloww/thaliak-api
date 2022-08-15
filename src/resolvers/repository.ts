import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { Repository } from '../models/repository';
import { Service } from 'typedi';

@ArgsType()
class FindOneArgs {
  @Field(() => ID)
  id: string;
}

@Service()
@Resolver(Repository)
export class RepositoryResolver {
  @Query(() => [Repository])
  async repositories() {
    return Repository.find();
  }

  @Query(() => Repository, { nullable: true })
  async repository(@Args() { id }: FindOneArgs) {
    return Repository.findOne({ where: { ...Repository.decode(id) } });
  }
}
