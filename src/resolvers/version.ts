import { Args, ArgsType, Field, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
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

  // these will need a slight rework in the future if multiple patches per logical version ever happen
  @FieldResolver(() => Date, { nullable: true })
  async firstSeen(@Root() version: Version) {
    const patches = await version.patches;
    return patches.length > 0 ? patches[0].firstSeen : null;
  }

  @FieldResolver(() => Date, { nullable: true })
  async firstOffered(@Root() version: Version) {
    const patches = await version.patches;
    return patches.length > 0 ? patches[0].firstOffered : null;
  }

  @FieldResolver(() => Date, { nullable: true })
  async lastSeen(@Root() version: Version) {
    const patches = await version.patches;
    return patches.length > 0 ? patches[0].lastSeen : null;
  }

  @FieldResolver(() => Date, { nullable: true })
  async lastOffered(@Root() version: Version) {
    const patches = await version.patches;
    return patches.length > 0 ? patches[0].lastOffered : null;
  }
}
