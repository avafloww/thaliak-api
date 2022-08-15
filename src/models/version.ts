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
import { OpaqueID, TransparentID } from '../util/opaqueId';

@ObjectType()
@Entity({ name: 'Versions' })
export class Version extends BaseEntity {

  @PrimaryGeneratedColumn({ name: 'Id' })
  public dbId: number;

  @Field(() => ID)
  public get id(): string {
    return OpaqueID.encode(Version, this.dbId);
  }

  public static decode(opaqueId: string): TransparentID {
    return OpaqueID.decode(Version, opaqueId);
  }

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
  @ManyToMany(() => File, f => f.versions, { lazy: true })
  @JoinTable({
    name: 'VersionFiles',
    joinColumns: [
      { name: 'VersionsId', referencedColumnName: 'dbId' },
    ],
    inverseJoinColumns: [
      { name: 'FilesName', referencedColumnName: 'name' },
      { name: 'FilesSHA1', referencedColumnName: 'sha1' },
    ],
  })
  public files: Promise<File[]>;
}