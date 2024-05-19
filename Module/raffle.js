import os from 'os';
import got from 'got';
import path from 'path';
import fs from 'graceful-fs';
import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import capsolver from '../Helpers/Functions/capsolver.js';
import fetchProxy from '../Helpers/Functions/parseProxy.js';
import sendWebhook from '../Helpers/Functions/sendWebhook.js';
import parseWebhook from '../Helpers/Functions/parseWebhook.js';
import createColorizedLogger from '../Helpers/Functions/logger.js';


async function enterRaffle(callback) {
    const logger = await createColorizedLogger();
    const questions = [{
        name: 'apiKey',
        type: 'input',
        message: 'Enter Capsolver API Key:'
    }];

    const answers = await inquirer.prompt(questions);
    const apiKey = answers.apiKey;
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const emailsPath = path.join(baseDir, 'emails.json');

    try {
        const data = await fs.promises.readFile(emailsPath, 'utf8');
        const emails = JSON.parse(data);

        for (let email of emails) {
            const taskId = uuidv4();
            await logger.http(`${taskId}: Fetching V3 Enterprise Captcha Token...`);
            const { captchaToken, userAgent } = await capsolver(apiKey);
            const sex = faker.person.sexType();
            const firstName = faker.person.firstName(sex);
            const lastName = faker.person.lastName();
            const proxyAgent = await fetchProxy();
            const webhookURL = await parseWebhook();

            logger.info(`${taskId}: Entering ${email} Into Raffle...`);

            const form = new FormData();
                form.append('Field1', firstName);
                form.append('Field2', lastName);
                form.append('Field3', email);
                form.append('Field4', '7');
                form.append('currentPage', 'H8lPw2AZDF2BPToQUwuBezA6IQ2yCr330fFZ2um66g9BYI=');
                form.append('saveForm', 'Submit');
                form.append('comment', '');
                form.append('idstamp', 'V2Sh4xLJQIGvUaouY09TbQ==');
                form.append('encryptedPassword', '');
                form.append('grcToken', captchaToken);
                form.append('stats', '{"errors":0,"startTime":2612773,"endTime":2621675,"referer":null}');
                form.append('clickOrEnter', 'click');

            const raffleUrl = 'https://skatewarehouse.wufoo.com/embed/m1sre9p219r6mp3?embedKey=m1sre9p219r6mp3556024&entsource=&referrer=';
            const raffleOptions = {
                method: 'POST',
                agent: {
                    http: proxyAgent,
                    https: proxyAgent
                },
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary9jYB0eR7CQEDjRTo',
                    'Origin': 'https://skatewarehouse.wufoo.com',
                    'Pragma': 'no-cache',
                    'Referer': 'https://skatewarehouse.wufoo.com/embed/m1sre9p219r6mp3?embedKey=m1sre9p219r6mp3556024&entsource=&referrer=',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': userAgent,
                    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"'
                },
                body: form
            };

            const raffleResponse = await got(raffleUrl, raffleOptions);
            if (raffleResponse.statusCode === 200 || raffleResponse.statusCode === 302) {                
                if (webhookURL) {
                    logger.verbose(`${taskId}: Successful Entry For ${email}...`);
                    await sendWebhook(email, webhookURL);

                } else {
                    logger.warn(`${taskId}: Successful Entry For ${email} - No Webhook Set...`);
                };
            };

            await new Promise(resolve => setTimeout(resolve, 1500));
        };

        if (callback) callback();

    } catch (error) {
        logger.error(`Failed to enter raffle: ${error.message}`);
    }
};

export default enterRaffle;