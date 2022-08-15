import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { Version } from '../models/version';
import { Service } from 'typedi';

@ArgsType()
class FindOneArgs {
  @Field(() => ID)
  id: string;
}

@Service()
@Resolver(Version)
export class VersionResolver {
  @Query(() => [Version])
  async versions() {
    return Version.find();
  }

  @Query(() => Version, { nullable: true })
  async version(@Args() { id }: FindOneArgs) {
    return Version.findOne({ where: { ...Version.decode(id) } });
  }
}
