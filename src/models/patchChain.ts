import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Repository } from './repository';
import { Patch } from './patch';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity({ name: 'PatchChains' })
export class PatchChain extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Field(() => Repository)
  @ManyToOne(() => Repository, { lazy: true })
  @JoinColumn({ name: 'RepositoryId' })
  public repository: Promise<Repository>;

  @Field(() => Patch)
  @ManyToOne(() => Patch, { lazy: true })
  @JoinColumn({ name: 'PatchId' })
  public patch: Promise<Patch>;

  @Field(() => Patch, { nullable: true })
  @ManyToOne(() => Patch, { nullable: true, lazy: true })
  @JoinColumn({ name: 'PreviousPatchId' })
  public previousPatch?: Promise<Patch>;

  @Field({ nullable: true })
  @Column({ name: 'FirstOffered', nullable: true })
  public firstOffered?: Date;

  @Field({ nullable: true })
  @Column({ name: 'LastOffered', nullable: true })
  public lastOffered?: Date;
}