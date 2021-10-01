import {SlackCommandMiddlewareArgs} from '@slack/bolt/dist/types';
import {getCustomRepository} from 'typeorm';
import {Team} from './entities/Team';
import {TeamRepository} from './repositories/TeamRepository';
import {UserRepository} from './repositories/UserRepository';
import {runData} from './run-data';

export const answerCommand = async ({ command, ack, respond, say }: SlackCommandMiddlewareArgs) => {
    // Acknowledge command request
    await ack();
    const answer = command.text.toLowerCase();
    if (runData.membersWithCorrectAnswer.includes(command.user_id)) {
        await respond(`You have already sent correct answer`);
        return;
    }
    if (!runData.currentAnswer) {
        await respond(`There is no quiz running currently`);
        return;
    }

    if (answer !== runData.currentAnswer.toLowerCase()) {
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
    userRepository.save(user);
    teamRepository.save(team);
    runData.currentPoints--;
    runData.membersWithCorrectAnswer.push(command.user_id);
    await say(`<@${command.user_name}> sent correct answer. ${team.teamName} has been awarded ${pointsAwarded} points`);

    if (runData.currentPoints === 5) {
        await say(`All points have been taken. Correct answer was ${runData.currentAnswer}.`);
        runData.currentAnswer = undefined;
        runData.currentQuestion = undefined;
        runData.currentPoints = 0;
        runData.membersWithCorrectAnswer.length = 0;
    }

}