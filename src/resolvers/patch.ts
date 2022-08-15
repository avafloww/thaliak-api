import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { Patch } from '../models/patch';
import { Service } from 'typedi';
import { Repository } from '../models/repository';

@ArgsType()
class FindManyArgs {
  @Field({ nullable: true })
  repositoryId?: string;

  @Field({ nullable: true })
  repositorySlug?: string;
}

@ArgsType()
class FindOneArgs extends FindManyArgs {
  @Field(() => ID)
  id: string;
}

@Service()
@Resolver(Patch)
export class PatchResolver {
  private filter({ repositoryId, repositorySlug }: FindManyArgs) {
    let filter = {
      repository: {},
    };

    if (repositoryId) {
      filter['repository'] = {
        ...Repository.decode(repositoryId),
      };
    }

    if (repositorySlug) {
      filter['repository'] = Object.assign(filter['repository'], {
        slug: repositorySlug,
      });
    }

    return filter;
  }

  @Query(() => [Patch])
  async patches(@Args() { repositoryId, repositorySlug }: FindManyArgs) {
    return Patch.find({
      relations: ['repository'],
      where: { ...this.filter({ repositoryId, repositorySlug }) },
    });
  }

  @Query(() => Patch, { nullable: true })
  async patch(@Args() { id, repositoryId, repositorySlug }: FindOneArgs) {
    return Patch.findOne({
      where: {
        ...Patch.decode(id),
        ...this.filter({ repositoryId, repositorySlug }),
      },
    });
  }
}
