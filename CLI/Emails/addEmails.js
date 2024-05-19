import os from 'os';
import path from 'path';
import fs from 'graceful-fs';
import inquirer from 'inquirer';
import createColorizedLogger from '../../Helpers/Functions/logger.js';

async function addEmails(callback) {
    const logger = await createColorizedLogger();
    const answers = await inquirer.prompt({
        name: 'emails',
        type: 'editor',
        message: 'Paste your emails (one per line):'
    });

    const emails = answers.emails.split(/\r?\n/).filter(email => email.trim());
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const emailsPath = path.join(baseDir, 'emails.json');

    try {
        let existingEmails = [];
        try {
            existingEmails = JSON.parse(await fs.promises.readFile(emailsPath, 'utf8'));

        } catch (error) {
            await logger.warn('Email File Nonexistent, Creating...');
        };

        const updatedEmails = [...existingEmails, ...emails];
        await fs.promises.writeFile(emailsPath, JSON.stringify(updatedEmails, null, 2));
        await logger.info('Emails Successfully Added...');

    } catch (error) {
        await logger.error('Failed To Add Emails...');
    }

    if (callback) callback();
}

export default addEmails;