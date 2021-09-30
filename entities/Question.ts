import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  question!: string;

  @Column('text')
  answer!: string;
}