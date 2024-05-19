import path from 'path';
import fs from 'graceful-fs';
import createColorizedLogger from './logger.js';

async function parseWebhook() {
    const logger = await createColorizedLogger();
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const settingsPath = path.join(baseDir, 'settings.json');

    try {
        const data = await fs.promises.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(data);

        if (!settings.webhookURL) {
            throw new Error("webhookURL is not defined in the settings");
        };

        return settings.webhookURL;

    } catch (error) {
        logger.error(`Failed To Fetch Webhook URL...`);
        return null;
    }
};

export default parseWebhook;