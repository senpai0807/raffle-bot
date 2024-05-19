import path from 'path';
import fs from 'graceful-fs';
import { HttpsProxyAgent } from 'https-proxy-agent';
import createColorizedLogger from './logger.js';

async function fetchProxy() {
    const logger = await createColorizedLogger();
    const baseDir = path.join(os.homedir(), 'Lunar Scripts');
    const proxiesPath = path.join(baseDir, 'proxies.json');

    try {
        const data = await fs.promises.readFile(proxiesPath, 'utf8');
        const proxies = JSON.parse(data);

        if (proxies.length === 0) {
            throw new Error("No proxies available");
        };

        const randomIndex = Math.floor(Math.random() * proxies.length);
        const randomProxy = proxies[randomIndex];
        const proxyParts = randomProxy.split(':');
        if (proxyParts.length !== 4) {
            throw new Error("Proxy format is incorrect");
        };

        const [host, port, username, password] = proxyParts;
        const proxyUrl = `http://${username}:${password}@${host}:${port}`;
        const proxyAgent = new HttpsProxyAgent(proxyUrl);
        return proxyAgent;

    } catch (error) {
        logger.error(`Error Fetching Proxy...`);
        return null;
    }
};

export default fetchProxy;