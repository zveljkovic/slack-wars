import {EntityRepository, Repository} from "typeorm";
import {User} from "../entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getBySlackId(slackId: string) {
    return this.findOne({where: {slackId}});
  }

  countUsersInTeam(teamId: string) {
    return this.count({where: {teamId}});
  }

  getThreeSortedByPoints() {
    return this.find({order: {score: 'DESC'}, take: 3});
  }

  addUser(entity: User){
    return this.save(entity);
  }
}