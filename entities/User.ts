import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  slackId!: string;

  @Column('uuid')
  teamId!: string;

  @Column('int')
  score!: number;

}