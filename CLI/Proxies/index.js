import inquirer from 'inquirer';
import addProxies from "./addProxies.js";
import testProxies from './testProxies.js';

async function handleProxiesMenu(startScript) {
    const answers = await inquirer.prompt({
        name: 'proxyChoice',
        type: 'list',
        message: 'Choose an option:',
        choices: ['1. Add Proxies', '2. Test Proxies', '3. Back']
    });

    switch (answers.proxyChoice) {
        case '1. Add Proxies':
            await addProxies(startScript);
            break;

        case '2. Test Proxies':
            await testProxies(startScript);
            break;

        case '3. Back':
            startScript();
            break;

        default:
            handleProxiesMenu();
    }
};

export default handleProxiesMenu;