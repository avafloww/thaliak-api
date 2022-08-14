import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn, JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Repository } from './repository';
import { Patch } from './patch';
import { File } from './file';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity({ name: 'Versions' })
export class Version extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Field()
  @Column({ name: 'VersionId' })
  public versionId: number;

  @Field()
  @Column({ name: 'VersionString' })
  public versionString: string;

  @Field(() => Repository)
  @ManyToOne(() => Repository, { lazy: true })
  @JoinColumn({ name: 'RepositoryId' })
  public repository: Promise<Repository>;

  @Field(() => [Patch])
  @OneToMany(() => Patch, (p) => p.version, { lazy: true })
  public patches: Promise<Patch[]>;

  @Field(() => [File])
  @ManyToMany(() => File, { lazy: true })
  @JoinTable({
    name: 'VersionFiles',
    joinColumns: [
      { name: 'VersionsId', referencedColumnName: 'id' },
    ],
    inverseJoinColumns: [
      { name: 'FilesName', referencedColumnName: 'name' },
      { name: 'FilesSHA1', referencedColumnName: 'sha1' },
    ],
  })
  public files: Promise<File[]>;
}