import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn} from "typeorm";
import {User} from './User';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  teamName!: string;

  @Column('int')
  score!: number;


  @OneToMany(type => User, user => user.id, {persistence: false})
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id'
  })
  public users: User[]

  constructor(teamName: string) {
    this.teamName = teamName;
    this.score = 0;
    this.users = [];
  }
}