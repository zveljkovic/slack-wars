import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  teamName!: string;

  @Column('int')
  score!: number;

  constructor(teamName: string) {
    this.teamName = teamName;
    this.score = 0;
  }
}