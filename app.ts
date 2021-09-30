import "reflect-metadata";
import {App} from '@slack/bolt';
import {createConnection, getConnection} from 'typeorm';
import {Question} from './entities/Question';
import {Team} from './entities/Team';
import {User} from './entities/User';
import {importQuestionsFromCSV} from './import_questions';
import {joinTeamCommand} from './join-team-command';
import {answerCommand} from './answer-command';
import {QuestionRepository} from './repositories/QuestionRepository';
import {TeamRepository} from './repositories/TeamRepository';
import {resetCommand} from './reset-command';
import {scoresCommand} from './scores-command';
import {triggerQuestionCommand} from './trigger-question-command';

require('dotenv').config();

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

console.log({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

(async () => {
    // Start your app
    await app.start(3000);
    const connection = await createConnection({
        type: "sqlite",
        database: "sqlite.db",
        entities: [Team, Question, User]} as any);

    const teamRepository = connection.getCustomRepository(TeamRepository);
    const teamCount = await teamRepository.count();
    if (teamCount === 0) {
        const redTeam = new Team('Red');
        teamRepository.save(redTeam);
        const blueTeam = new Team('Blue');
        teamRepository.save(blueTeam);
        const greenTeam = new Team('Green');
        teamRepository.save(greenTeam);
    }

    const questionRepository = connection.getCustomRepository(QuestionRepository);
    const questionCount = await questionRepository.count();
    if (questionCount === 0) {
        await importQuestionsFromCSV();
    }

    app.command('/answer', answerCommand);

    app.command('/jointeam', joinTeamCommand);

    app.command('/scores', scoresCommand);

    app.command('/trigger-question', triggerQuestionCommand);

    app.command('/reset', resetCommand);

    console.log('⚡️ Bolt app is running!');
})();



const welcomeChannelId = 'C12345';

app.event('member_joined_channel', async ({ event, client }) => {
    try {
        // Call chat.postMessage with the built-in client
        const result = await client.chat.postMessage({
            channel: welcomeChannelId,
            text: `Welcome to the quiz <@${event.user.id}>!`
        });
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
});

