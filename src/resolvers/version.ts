import { Args, ArgsType, Field, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Version } from '../models/version';
import { Service } from 'typedi';
import { genOptsFromQuery } from '../util/queryHelpers';
import { remapInput, RepositoryInputMapOptions } from '../util/inputRemapping';
import { GraphQLBoolean } from 'graphql';
import { Patch } from '../models/patch';

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

  @FieldResolver(() => GraphQLBoolean)
  async isActive(@Root() version: Version) {
    const patches = await version.patches;
    return patches.filter(patch => patch.isActive).length > 0;
  }

  @FieldResolver(() => [Version])
  async prerequisiteVersions(@Root() version: Version) {
    const versions: Version[] = [];
    const verPatches = await version.patches;
    if (verPatches.length > 0) {
      const patches = await verPatches[0].prerequisitePatches;

      for (const p of patches) {
        const next: Patch | null = await p.previousPatch;
        if (next != null) {
          versions.push(await next.version);
        }
      }
    }

    return versions;
  }

  @FieldResolver(() => [Version])
  async dependentVersions(@Root() version: Version) {
    const versions: Version[] = [];
    const verPatches = await version.patches;
    if (verPatches.length > 0) {
      const patches = await verPatches[0].dependentPatches;

      for (const p of patches) {
        const next: Patch = await p.patch;
        versions.push(await next.version);
      }
    }

    return versions;
  }
}
