//remember to add package you use to package json
import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';

const parseCsv = async () => {
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
  console.log(questions);
}
