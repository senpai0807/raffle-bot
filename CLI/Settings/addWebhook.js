import os from 'os';
import path from 'path';
import fs from 'graceful-fs';
import inquirer from 'inquirer';
import createColorizedLogger from '../../Helpers/Functions/logger.js';

async function addWebhook(callback) {
    const logger = await createColorizedLogger();
    const questions = [{
        name: 'webhookURL',
        type: 'input',
        message: 'Enter your Discord webhook URL:',
        validate: input => {
            if (!input.startsWith('https://discord.com/api/webhooks')) {
                return 'URL must start with "https://discord.com/api/webhooks". Please enter a valid webhook URL.';
            }
            return true;
        }
    }];

    const answers = await inquirer.prompt(questions);
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const settingsPath = path.join(baseDir, 'settings.json');

    try {
        let settings = {};
        try {
            settings = JSON.parse(await fs.promises.readFile(settingsPath, 'utf8'));

        } catch (error) {
            await logger.warn('Settings File Nonexistent, Creating...');
        }

        settings.webhookURL = answers.webhookURL;
        await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2));
        await logger.info('Webhook Successfully Saved...');

    } catch (error) {
        await logger.error('Failed To Update Settings...');
    }

    if (callback) callback();
}

export default addWebhook;
