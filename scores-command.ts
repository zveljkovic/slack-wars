import {SlackCommandMiddlewareArgs} from '@slack/bolt/dist/types';
import {getCustomRepository} from 'typeorm';
import {Team} from './entities/Team';
import {TeamRepository} from './repositories/TeamRepository';
import {UserRepository} from './repositories/UserRepository';

export const scoresCommand = async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
    // Acknowledge command request
    await ack();

    const teamRepository = getCustomRepository(TeamRepository);
    const teams = await teamRepository.getAll();
    teams.sort((a: Team, b: Team) => b.score - a.score);

    let response = teams.map(t => `${t.teamName} has ${t.score} points`).join('. ');
    const userRepository = getCustomRepository(UserRepository);
    const users = await userRepository.getThreeSortedByPoints();
    response += '\n' + users.map((x) => `<@${x.slackId}> has ${x.score} points`).join('. ');
    const user = await userRepository.getBySlackId(command.user_id);
    if (!user) {
        throw new Error('User not found in scores command');
    }
    response += `\nYou have ${user.score} points`;
    await respond(response);
}
