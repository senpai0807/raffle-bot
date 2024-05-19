import os from 'os';
import path from 'path';
import fs from 'graceful-fs';
import inquirer from 'inquirer';
import createColorizedLogger from '../../Helpers/Functions/logger.js';

async function addProxies(callback) {
    const logger = await createColorizedLogger();
    const answers = await inquirer.prompt({
        name: 'proxies',
        type: 'editor',
        message: 'Paste your proxies (one per line):'
    });

    const proxies = answers.proxies.split(/\r?\n/);
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const proxiesPath = path.join(baseDir, 'proxies.json');

    try {
        const existingProxies = JSON.parse(await fs.promises.readFile(proxiesPath, 'utf8'));
        const updatedProxies = [...existingProxies, ...proxies.filter(proxy => proxy.trim())];
        await fs.promises.writeFile(proxiesPath, JSON.stringify(updatedProxies, null, 2));
        await logger.info('Proxies Successfully Added...');
        
    } catch (error) {
        await logger.error('Failed To Add Proxies...');
    }

    if (callback) callback();
}

export default addProxies;