import {SlackCommandMiddlewareArgs} from '@slack/bolt/dist/types';

export const answerCommand = async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
    // Acknowledge command request
    await ack();

    await respond(`${command.text}`);
}