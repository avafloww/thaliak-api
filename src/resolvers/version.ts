import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { Version } from '../models/version';
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
}

@ArgsType()
class FindOneArgs extends FindManyArgs {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  versionString?: string;
}

@Service()
@Resolver(Version)
export class VersionResolver {
  @Query(() => [Version])
  async versions(@Args() args: FindManyArgs) {
    return Version.find(genOptsFromQuery(
      Version, false, remapInput(Version, RepositoryInputMapOptions, args),
    ));
  }

  @Query(() => Version, { nullable: true })
  async version(@Args() args: FindOneArgs) {
    return Version.findOne(genOptsFromQuery(
      Version, true, remapInput(Version, RepositoryInputMapOptions, args),
    ));
  }
}
