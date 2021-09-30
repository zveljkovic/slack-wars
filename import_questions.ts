//remember to add package you use to package json
import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';
import bluebird from 'bluebird';
import {getCustomRepository} from 'typeorm';
import {Question} from './entities/Question';
import {QuestionRepository} from './repositories/QuestionRepository';

const parseCsv = async (): Promise<{ Question: string; Answer: string }[]> => {
  return new Promise((resolve) => {
    const results: { Question: string; Answer: string }[] = [];
    const filepath = path.join(__dirname, "data", "Spa_Team_s_Questions-Oggy.csv");

    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      });
  });
}

export const importQuestionsFromCSV = async () => {
  const questions = await parseCsv();
  const questionRepository = getCustomRepository(QuestionRepository);
  bluebird.each(questions, (question) => {
    const newQuestion = new Question();
    newQuestion.question = question.Question;
    newQuestion.answer = question.Answer;
    return questionRepository.save(newQuestion);
  });
  console.log(questions);
}
