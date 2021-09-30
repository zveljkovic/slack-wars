import {SlackCommandMiddlewareArgs} from '@slack/bolt/dist/types';

export const scoresCommand = async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
    // Acknowledge command request
    await ack();


    await respond(`${command.text}`);
}
