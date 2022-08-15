import { Args, ArgsType, Field, ID, Query, Resolver } from 'type-graphql';
import { File } from '../models/file';
import { Service } from 'typedi';

@ArgsType()
class FindManyArgs {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  sha1?: string;
}

@ArgsType()
class FindOneArgs extends FindManyArgs {
  @Field(() => ID, { nullable: true })
  id?: string;
}

@Service()
@Resolver(File)
export class FileResolver {
  @Query(() => [File])
  async files(@Args() { name, sha1 }: FindManyArgs) {
    if (sha1 && name) {
      return File.find({ where: { sha1, name } });
    }

    if (sha1) {
      return File.find({ where: { sha1 } });
    }

    if (name) {
      return File.find({ where: { name } });
    }
  }

  @Query(() => File, { nullable: true })
  async file(@Args() { id, name, sha1 }: FindOneArgs) {
    if (id) {
      return File.findOne({ where: { ...File.decode(id) } });
    }

    if (sha1 && name) {
      return File.findOne({ where: { sha1, name } });
    }

    if (sha1) {
      return File.findOne({ where: { sha1 } });
    }

    if (name) {
      return File.findOne({ where: { name } });
    }
  }
}
