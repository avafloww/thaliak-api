import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

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
}