import os from 'os';
import got from 'got';
import path from 'path';
import fs from 'graceful-fs';
import { HttpsProxyAgent } from 'https-proxy-agent';
import createColorizedLogger from '../../Helpers/Functions/logger.js';

async function testProxies(callback) {
    const logger = await createColorizedLogger();
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const proxiesPath = path.join(baseDir, 'proxies.json');
    let proxies;

    try {
        const data = await fs.promises.readFile(proxiesPath, 'utf8');
        proxies = JSON.parse(data);
    } catch (error) {
        await logger.error('Failed to read proxies:', error);
        if (callback) callback();
        return;
    }

    for (let i = 0; i < proxies.length; i++) {
        const proxy = proxies[i];
        const proxyParts = proxy.split(':');
        if (proxyParts.length !== 4) {
            await logger.error(`Proxy format is incorrect for index ${i + 1}: ${proxy}`);
            continue;
        }
        const [host, port, username, password] = proxyParts;
        const proxyTested = `${host}:${port}:${username}:${password}`;
        const proxyUrl = `http://${username}:${password}@${host}:${port}`;
        const proxyAgent = new HttpsProxyAgent(proxyUrl);

        const url = 'https://www.google.com/';
        const options = {
            method: 'GET',
            agent: {
                http: proxyAgent,
                https: proxyAgent
            },
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'priority': 'u=0, i',
                'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'sec-ch-ua-arch': '"x86"',
                'sec-ch-ua-bitness': '"64"',
                'sec-ch-ua-full-version': '"124.0.6367.209"',
                'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.209", "Google Chrome";v="124.0.6367.209", "Not-A.Brand";v="99.0.0.0"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': '""',
                'sec-ch-ua-platform': '"Windows"',
                'sec-ch-ua-platform-version': '"15.0.0"',
                'sec-ch-ua-wow64': '?0',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            }
        };
        const startTime = Date.now();
        const response = await got(url, options);
        if (response.statusCode === 200) {
            const endTime = Date.now();
            const speed = endTime - startTime;

            await logger.info(`${i + 1} - ${proxyTested}: ${speed}ms`);
        };
    }

    if (callback) callback();
}

export default testProxies;