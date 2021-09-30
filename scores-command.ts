import {SlackCommandMiddlewareArgs} from '@slack/bolt/dist/types';
import {getCustomRepository} from 'typeorm';
import {Team} from './entities/Team';
import {TeamRepository} from './repositories/TeamRepository';

export const scoresCommand = async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
    // Acknowledge command request
    await ack();

    const teamRepository = getCustomRepository(TeamRepository);
    const teams = await teamRepository.getAll();
    teams.sort((a: Team, b: Team) => b.score - a.score);
    const response = teams.map(t => `${t.teamName} has ${t.score} points`).join('\n');
    await respond(response);
}
