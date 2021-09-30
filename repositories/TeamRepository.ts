import {EntityRepository, Repository} from "typeorm";
import {Team} from "../entities/Team";

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {

  resetTeams() {
    return this.query('UPDATE "Team" SET score = 0;');
  }

  getAll() {
    return this.find();
  }
}