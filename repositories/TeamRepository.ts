import {EntityRepository, Repository} from "typeorm";
import {Team} from "../entities/Team";

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {

  resetTeams() {
    return this.query('UPDATE "team" SET score = 0;');
  }

  getAll() {
    return this.find();
  }

  getOneById(id: string) {
    return this.findOne({where: {id}});
  }
}