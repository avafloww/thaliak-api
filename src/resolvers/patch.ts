import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { Patch } from '../models/patch';
import { Service } from 'typedi';

@ArgsType()
class FindOneArgs {
  @Field(() => ID)
  id: number;
}

@Service()
@Resolver(Patch)
export class PatchResolver {
  @Query(() => [Patch])
  async patches() {
    return Patch.find();
  }

  @Query(() => Patch)
  async patch(@Args() { id }: FindOneArgs) {
    return Patch.find({ where: { id } });
  }
}
