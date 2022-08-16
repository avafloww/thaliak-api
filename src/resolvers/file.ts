import { Arg, Args, ArgsType, Field, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { File } from '../models/file';
import { Service } from 'typedi';
import { genOptsFromQuery } from '../util/queryHelpers';
import { BaseInputMapOptions, remapInput } from '../util/inputRemapping';
import { Version } from '../models/version';

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
  async files(@Args() args: FindManyArgs) {
    return File.find(
      genOptsFromQuery(File, false, {
        ...args
      })
    );
  }

  @Query(() => File, { nullable: true })
  async file(@Args() { id, ...args }: FindOneArgs) {
    return File.findOne(
      genOptsFromQuery(File, false, id ? File.decode(id) : args)
    );
  }

  @FieldResolver(() => Version, { nullable: true })
  async version(@Root() file: File, @Arg('id') versionId: string) {
    const filtered = (await file.versions).filter((v) => v.id == versionId);
    return filtered.length == 1 ? filtered[0] : null;
  }
}
