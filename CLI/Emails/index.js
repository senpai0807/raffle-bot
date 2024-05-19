import inquirer from 'inquirer';
import addEmails from './addEmails.js';

async function handleEmailsMenu(startScript) {
    const answers = await inquirer.prompt({
        name: 'emailsChoice',
        type: 'list',
        message: 'Choose an option:',
        choices: ['1. Add Emails', '2. Back']
    });

    switch (answers.emailsChoice) {
        case '1. Add Emails':
            await addEmails(startScript);
            break;

        case '2. Back':
            startScript();
            break;
            
        default:
            handleEmailsMenu();
    }
};

export default handleEmailsMenu;