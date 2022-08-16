import { Arg, Args, ArgsType, Field, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Repository } from '../models/repository';
import { Service } from 'typedi';
import { genOptsFromQuery } from '../util/queryHelpers';
import { Version } from '../models/version';
import { BaseInputMapOptions, remapInput } from '../util/inputRemapping';

@ArgsType()
class FindOneArgs {
  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => ID, { nullable: true })
  id?: string;
}

@Service()
@Resolver(Repository)
export class RepositoryResolver {
  @Query(() => [Repository])
  async repositories() {
    return Repository.find();
  }

  @Query(() => Repository, { nullable: true })
  async repository(@Args() args: FindOneArgs) {
    return Repository.findOne(genOptsFromQuery(
      Repository, true, remapInput(Version, BaseInputMapOptions, args),
    ));
  }

  @FieldResolver(() => Version)
  async latestVersion(@Root() repository: Repository) {
    const sorted = (await repository.versions).sort((a, b) => b.versionId - a.versionId);
    return sorted[0];
  }

  @FieldResolver(() => Version, { nullable: true })
  async version(@Root() repository: Repository, @Arg('id') versionId: string) {
    const filtered = (await repository.versions).filter((v) => v.id == versionId);
    return filtered.length == 1 ? filtered[0] : null;
  }
}
