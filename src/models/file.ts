import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Version } from './version';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { OpaqueID } from '../util/opaqueId';

@ObjectType()
@Entity({ name: 'Files' })
export class File extends BaseEntity {

  @Field()
  @PrimaryColumn({ name: 'Name' })
  public name: string;

  @Field()
  @PrimaryColumn({ name: 'SHA1' })
  public sha1: string;

  @Field(() => Int)
  @Column({ name: 'Size' })
  public size: number;

  @Field()
  @Column({ name: 'LastUsed' })
  public lastUsed: Date;

  @Field(() => [Version])
  @ManyToMany(() => Version, v => v.files, { lazy: true })
  public versions: Promise<Version[]>;

  @Field(() => ID)
  public get id(): string {
    return OpaqueID.encodeExtended(File, this.name, this.sha1);
  }

  public static decode(opaqueId: string): {
    name: string,
    sha1: string
  } {
    const etid = OpaqueID.decodeExtended(File, opaqueId);
    return {
      name: etid.param,
      sha1: etid.transparentID.dbId
    }
  }
}