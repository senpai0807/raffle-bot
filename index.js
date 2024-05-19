import os from 'os';
import path from 'path';
import fs from 'graceful-fs';
import inquirer from 'inquirer';
import enterRaffle from './Module/raffle.js';
import handleEmailsMenu from './CLI/Emails/index.js';
import handleProxiesMenu from './CLI/Proxies/index.js';
import handleSettingsMenu from './CLI/Settings/index.js';
import createColorizedLogger from './Helpers/Functions/logger.js';

async function ensureSetup() {
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    await fs.promises.mkdir(baseDir, { recursive: true });

    const files = ['settings.json', 'emails.json', 'proxies.json'];
    const defaultContents = {
        'settings.json': '{}',
        'emails.json': '[]',
        'proxies.json': '[]'
    };

    for (let file of files) {
        const filePath = path.join(baseDir, file);
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
        } catch (err) {
            await fs.promises.writeFile(filePath, defaultContents[file], 'utf8');
        }
    }
};

async function startScript() {
    const logger = await createColorizedLogger();
    await ensureSetup();
    console.log(`
    ##       ##     ## ##    ##    ###    ########      ######   ######  ########  #### ########  ########  ######  
    ##       ##     ## ###   ##   ## ##   ##     ##    ##    ## ##    ## ##     ##  ##  ##     ##    ##    ##    ## 
    ##       ##     ## ####  ##  ##   ##  ##     ##    ##       ##       ##     ##  ##  ##     ##    ##    ##       
    ##       ##     ## ## ## ## ##     ## ########      ######  ##       ########   ##  ########     ##     ######  
    ##       ##     ## ##  #### ######### ##   ##            ## ##       ##   ##    ##  ##           ##          ## 
    ##       ##     ## ##   ### ##     ## ##    ##     ##    ## ##    ## ##    ##   ##  ##           ##    ##    ## 
    ########  #######  ##    ## ##     ## ##     ##     ######   ######  ##     ## #### ##           ##     ######  
`);

    logger.info('Welcome, User');
    const answers = await inquirer.prompt({
        name: 'choice',
        type: 'list',
        message: 'Choose an option:',
        choices: [
            '1. Raffle',
            '2. Emails',
            '3. Proxies',
            '4. Settings',
            '5. Exit'
        ]
    });

    switch (answers.choice) {
        case '1. Raffle':
            await enterRaffle(startScript);
            break;

        case '2. Emails':
            await handleEmailsMenu(startScript);
            break;

        case '3. Proxies':
            await handleProxiesMenu(startScript);
            break;

        case '4. Settings':
            await handleSettingsMenu(startScript);
            break;

        case '5. Exit':
            await exitApplication();
            break;

        default:
            startScript();
    }
};

async function exitApplication() {
    const logger = await createColorizedLogger();
    logger.warn('Exiting Client...');
    process.exit(0);
}

startScript();
