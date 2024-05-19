import inquirer from 'inquirer';
import addWebhook from './addWebhook.js';
import testWebhook from './testWebhook.js';

async function handleSettingsMenu(startScript) {
    const answers = await inquirer.prompt({
        name: 'settingsChoice',
        type: 'list',
        message: 'Choose an option:',
        choices: ['1. Add Webhook', '2. Test Webhook', '3. Back']
    });

    switch (answers.settingsChoice) {
        case '1. Add Webhook':
            await addWebhook(startScript);
            break;

        case '2. Test Webhook':
            await testWebhook(startScript);
            break;

        case '3. Back':
            startScript();
            break;
            
        default:
            handleSettingsMenu();
    }
};

export default handleSettingsMenu;