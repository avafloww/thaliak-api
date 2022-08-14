import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { PatchChain } from '../models/patchChain';
import { Service } from 'typedi';

@ArgsType()
class FindOneArgs {
  @Field(() => ID)
  id: number;
}

@Service()
@Resolver(PatchChain)
export class PatchChainResolver {
  @Query(() => [PatchChain])
  async patchChains() {
    return PatchChain.find();
  }

  @Query(() => PatchChain)
  async patchChain(@Args() { id }: FindOneArgs) {
    return PatchChain.findOne({ where: { id } });
  }
}
