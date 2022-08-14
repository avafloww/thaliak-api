import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Version } from './version';

@ObjectType()
@Entity({ name: 'Repositories' })
export class Repository extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

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