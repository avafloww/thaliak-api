import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { File } from '../models/file';
import { Service } from 'typedi';

@ArgsType()
class FindOneArgs {
  @Field(() => ID)
  id: string;
}

@Service()
@Resolver(File)
export class FileResolver {
  @Query(() => [File])
  async files() {
    return File.find();
  }

  @Query(() => File)
  async file(@Args() { id }: FindOneArgs) {
    const [name, sha1] = id.split('@');

    return File.findOne({
      where: {
        name, sha1,
      },
    });
  }
}
