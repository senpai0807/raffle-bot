import os from 'os';
import got from 'got';
import path from 'path';
import fs from 'graceful-fs';
import createColorizedLogger from '../../Helpers/Functions/logger.js';

async function testWebhook(callback) {
    const logger = await createColorizedLogger();
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const settingsPath = path.join(baseDir, 'settings.json');
    let settings;

    try {
        const data = await fs.promises.readFile(settingsPath, 'utf8');
        settings = JSON.parse(data);

    } catch (error) {
        await logger.error('Failed To Read Settings File...');
        if (callback) callback();
        return;
    }

    if (!settings.webhookURL) {
        await logger.error('Webhook Not Set...');
        if (callback) callback();
        return;
    }

    const webhookURL = settings.webhookURL;
    const embed = {
        username: 'Lunar Scripts',
        avatar_url: 'https://imgur.com/Vn4CEtQ.png',
        embeds: [{
            title: 'Successful Test 🌙',
            color: 5662170,
            footer: {
                text: 'Lunar Scripts',
                icon_url: 'https://imgur.com/Vn4CEtQ.png'
            },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await got.post(webhookURL, {
            json: embed,
            responseType: 'json'
        });
        await logger.info('Webhook test sent successfully:', response.body);
    } catch (error) {
        await logger.error('Failed to send webhook test:', error.response.body);
    }

    if (callback) callback();
}

export default testWebhook;