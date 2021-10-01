import {SlackCommandMiddlewareArgs} from '@slack/bolt/dist/types';
import {getCustomRepository} from 'typeorm';
import {QuestionRepository} from './repositories/QuestionRepository';
import {runData} from './run-data';

export const triggerQuestionCommand = async ({ command, ack, say }: SlackCommandMiddlewareArgs) => {
    // Acknowledge command request
    await ack();
    const questionRepository = getCustomRepository(QuestionRepository);
    const question = await questionRepository.randomQuestion();
    await say(`${question.question}`);
    runData.currentQuestion = question.question;
    runData.currentAnswer = question.answer;
    runData.currentPoints = 7;
    runData.membersWithCorrectAnswer.length = 0;
}
