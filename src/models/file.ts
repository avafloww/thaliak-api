import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Version } from './version';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity({ name: 'Files' })
export class File extends BaseEntity {

  @Field()
  @PrimaryColumn({ name: 'Name' })
  public name: string;

  @Field()
  @PrimaryColumn({ name: 'SHA1' })
  public sha1: string;

  @Field()
  @Column({ name: 'Size' })
  public size: number;

  @Field()
  @Column({ name: 'LastUsed' })
  public lastUsed: Date;

  @Field(() => [Version])
  @ManyToMany(() => Version, { lazy: true })
  public versions: Promise<Version[]>;

  @Field(() => ID)
  public get id(): string {
    return `${(this.name)}@${this.sha1}`;
  }
}