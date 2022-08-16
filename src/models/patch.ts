import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Version } from './version';
import { Repository } from './repository';
import { PatchChain } from './patchChain';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { OpaqueID, TransparentID } from '../util/opaqueId';

@ObjectType()
@Entity({ name: 'Patches' })
export class Patch extends BaseEntity {

  @PrimaryGeneratedColumn({ name: 'Id' })
  public dbId: number;

  @Field(() => ID)
  public get id(): string {
    return OpaqueID.encode(Patch, this.dbId);
  }

  public static decode(opaqueId: string): TransparentID {
    return OpaqueID.decode(Patch, opaqueId);
  }

  @Field(() => Version)
  @ManyToOne(() => Version, { lazy: true })
  @JoinColumn({ name: 'VersionId' })
  public version: Promise<Version>;

  @Field(() => Repository)
  @ManyToOne(() => Repository, { lazy: true })
  @JoinColumn({ name: 'RepositoryId' })
  public repository: Promise<Repository>;

  @Field()
  @Column({ name: 'RemoteOriginPath' })
  public url: string;

  @Column({ name: 'LocalStoragePath' })
  public localStoragePath: string;

  @Field({ nullable: true })
  @Column({ name: 'FirstSeen', nullable: true })
  public firstSeen?: Date;

  @Field({ nullable: true })
  @Column({ name: 'LastSeen', nullable: true })
  public lastSeen?: Date;

  @Field({ nullable: true })
  @Column({ name: 'FirstOffered', nullable: true })
  public firstOffered?: Date;

  @Field({ nullable: true })
  @Column({ name: 'LastOffered', nullable: true })
  public lastOffered?: Date;

  @Field(() => Int)
  @Column({ name: 'Size' })
  public size: number;

  @Field({ nullable: true })
  @Column({ name: 'HashType', nullable: true })
  public hashType?: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'HashBlockSize', nullable: true })
  public hashBlockSize?: number;

  @Field(() => [PatchChain])
  @OneToMany(() => PatchChain, (c) => c.patch, { lazy: true })
  public prerequisitePatches: Promise<PatchChain[]>;

  @Field(() => [PatchChain])
  @OneToMany(() => PatchChain, (c) => c.previousPatch, { lazy: true })
  public dependentPatches: Promise<PatchChain[]>;
}