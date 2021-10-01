import {EntityRepository, Repository} from "typeorm";
import {Question} from "../entities/Question";

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {

  async randomQuestion(): Promise<Question> {
    const questions = await this.query('SELECT * FROM "question" ORDER BY RANDOM() LIMIT 1') as Question[];
    return questions[0];
  }
}