import { Args, ArgsType, Field, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Patch } from '../models/patch';
import { Service } from 'typedi';
import { genOptsFromQuery } from '../util/queryHelpers';
import { remapInput, RepositoryInputMapOptions } from '../util/inputRemapping';
import { Version } from '../models/version';

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

  @FieldResolver(() => String)
  async versionString(@Root() patch: Patch) {
    return (await patch.version).versionString;
  }

  @FieldResolver(() => [Version])
  async prerequisiteVersions(@Root() patch: Patch) {
    const versions: Version[] = [];
    const patches = await patch.prerequisitePatches;

    for (const p of patches) {
      const next: Patch | null = await p.previousPatch;
      if (next != null) {
        versions.push(await next.version);
      }
    }

    return versions;
  }

  @FieldResolver(() => [Version])
  async dependentVersions(@Root() patch: Patch) {
    const versions: Version[] = [];
    const patches = await patch.dependentPatches;

    for (const p of patches) {
      const next: Patch = await p.patch;
      versions.push(await next.version);
    }

    return versions;
  }
}
