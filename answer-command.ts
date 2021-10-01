import {SlackCommandMiddlewareArgs} from '@slack/bolt/dist/types';
import {getCustomRepository} from 'typeorm';
import {Team} from './entities/Team';
import {TeamRepository} from './repositories/TeamRepository';
import {UserRepository} from './repositories/UserRepository';
import {runData} from './run-data';

export const answerCommand = async ({ command, ack, respond, say }: SlackCommandMiddlewareArgs) => {
    // Acknowledge command request
    await ack();
    const answer = command.text;
    if (answer !== runData.currentAnswer) {
        await respond(`Your answer _${command.text}_ is not correct`);
        return;
    }
    const userRepository = getCustomRepository(UserRepository);
    const teamRepository = getCustomRepository(TeamRepository);
    const user = await userRepository.getBySlackId(command.user_id);
    if (!user) {
        throw new Error('User not found')
    }
    const team = await teamRepository.getOneById(user.teamId);
    if (!team) {
        throw new Error('User not found')
    }

    const pointsAwarded = runData.currentPoints;
    user.score += pointsAwarded;
    team.score += pointsAwarded;
    runData.currentPoints--;
    if (runData.currentPoints === 2) {
        runData.currentAnswer = undefined;
        runData.currentQuestion = undefined;
        runData.currentPoints = 0;
    }
    await say(`<@${command.user_name}> sent correct answer. He won ${team.teamName} the ${pointsAwarded} points`);

}