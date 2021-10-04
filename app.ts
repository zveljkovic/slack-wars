import "reflect-metadata";
import {App} from '@slack/bolt';
import bluebird from 'bluebird';
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
import {getCustomRepository} from 'typeorm';
import {UserRepository} from './repositories/UserRepository';

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
        await teamRepository.save(redTeam);
        const blueTeam = new Team('Blue');
        await teamRepository.save(blueTeam);
        const greenTeam = new Team('Green');
        await teamRepository.save(greenTeam);
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

app.event('member_joined_channel', async ({ event, client, say }) => {
    const userRepository = getCustomRepository(UserRepository);
    const teamRepository = getCustomRepository(TeamRepository);
    const teams = await teamRepository.getAll();


    let user = await userRepository.getBySlackId(event.user);

    if(!user){
         user = new User();
         user.slackId = event.user;
         user.score = 0;
    }

    let teamWithFewestUsersId = '';
    let numberOfUsers = 100000000;

    await bluebird.each(teams, async (x) => {
        const teamUserCount = await userRepository.countUsersInTeam(x.id);
        if(teamUserCount <= numberOfUsers) {
            numberOfUsers = teamUserCount;
            teamWithFewestUsersId = x.id;
        }
    })
    user.teamId = teamWithFewestUsersId;
    await userRepository.save(user);
    const team = await teamRepository.getOneById(user.teamId);
    if (!team) {
        throw new Error('Unknown team');
    }

    try {
        const result = await client.chat.postMessage({
            channel: event.channel,
            text: `<@${event.user}> welcome to Slack Wars - ${team.teamName} team! Please see the last question or wait for a new one.`
        });
        const result2 = await say(`Answer is submitted with "/answer your answer" and you can check the scores with "/scores"`);
    }
    catch (error) {
        console.error(error);
    }
});

