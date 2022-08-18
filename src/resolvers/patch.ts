import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { Patch } from '../models/patch';
import { Service } from 'typedi';
import { genOptsFromQuery } from '../util/queryHelpers';
import { remapInput, RepositoryInputMapOptions } from '../util/inputRemapping';

@ArgsType()
export class FindManyArgs {
  @Field({ nullable: true })
  repositoryId?: string;

  @Field({ nullable: true })
  repositorySlug?: string;

  @Field({ nullable: true })
  repositoryName?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ArgsType()
class FindOneArgs extends FindManyArgs {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  url?: string;
}

@Service()
@Resolver(Patch)
export class PatchResolver {
  @Query(() => [Patch])
  async patches(@Args() args: FindManyArgs) {
    return Patch.find(genOptsFromQuery(
      Patch, false, remapInput(Patch, RepositoryInputMapOptions, args),
    ));
  }

  @Query(() => Patch, { nullable: true })
  async patch(@Args() args: FindOneArgs) {
    return Patch.findOne(genOptsFromQuery(
      Patch, true, remapInput(Patch, RepositoryInputMapOptions, args),
    ));
  }
}
