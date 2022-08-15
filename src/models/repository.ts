import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Version } from './version';
import { OpaqueID, TransparentID } from '../util/opaqueId';

@ObjectType()
@Entity({ name: 'Repositories' })
export class Repository extends BaseEntity {

  @PrimaryGeneratedColumn({ name: 'Id' })
  public dbId: number;

  @Field(() => ID)
  public get id(): string {
    return OpaqueID.encode(Repository, this.dbId);
  }

  public static decode(opaqueId: string): TransparentID {
    return OpaqueID.decode(Repository, opaqueId);
  }

  @Field()
  @Column({ name: 'Name' })
  public name: string;

  @Field({ nullable: true })
  @Column({ name: 'Description' })
  public description?: string;

  @Field()
  @Column({ name: 'Slug' })
  public slug: string;

  @Field(() => [Version])
  @OneToMany(() => Version, v => v.repository, { lazy: true })
  public versions: Promise<Version[]>;
}