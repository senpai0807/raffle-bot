import got from 'got';
import createColorizedLogger from './logger.js';

async function capsolver(apiKey) {
    const logger = await createColorizedLogger();
    const siteKey = '6LeASGocAAAAADj3Vpi-QsmxJutvYUg4DQcU-MNB';
    const websiteURL = 'https://skatewarehouse.wufoo.com/embed/m1sre9p219r6mp3?embedKey=m1sre9p219r6mp3556024&entsource=&referrer=';
    const captchaType = 'ReCaptchaV3EnterpriseTaskProxyLess';

    const capsolverCreateTasks = `https://api.capsolver.com/createTask`;
    const capsolverCreateTaskOptions = {
        method: 'POST',
        headers: {
            'host': 'api.capsolver.com',
            'content-type': 'application/json'
        },
        json: {
            "clientKey": apiKey,
            "task": {
                "type": captchaType,
                "websiteURL": websiteURL,
                "websiteKey": siteKey
            }
        },
        responseType: 'json'
    };

    let capsolverResponse;
    try {
        const createTaskResponse = await got(capsolverCreateTasks, capsolverCreateTaskOptions);
        if (createTaskResponse.statusCode === 200) {
            const responseBody = createTaskResponse.body;
            capsolverResponse = responseBody;

            const fetchCapsolverResponse = `https://api.capsolver.com/getTaskResult`;
            let captchaTokenBody;
            do {
                const response = await got(fetchCapsolverResponse, {
                    method: 'POST',
                    headers: {
                        'host': 'api.capsolver.com',
                        'content-type': 'application/json'
                    },
                    json: {
                        "clientKey": apiKey,
                        "taskId": capsolverResponse.taskId
                    },
                    responseType: 'json'
                });
                if (response && response.body) {
                    captchaTokenBody = response.body;
                    if (!captchaTokenBody || captchaTokenBody.status === 'processing') {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                    };

                } else {
                    throw new Error("Failed to fetch captcha token");
                }
            } while (!captchaTokenBody || captchaTokenBody.status === 'processing');
    
            if (captchaTokenBody && captchaTokenBody.solution) {
                const captchaToken = captchaTokenBody.solution.gRecaptchaResponse;
                const userAgent = captchaTokenBody.solution.userAgent;
    
                return { captchaToken, userAgent };
            } else {
                throw new Error('Captcha token retrieval failed.');
            }
        } else {
            throw new Error('Task creation failed.');
        }
    } catch (error) {
        logger.error('Error Solving V3 Captcha...');
    }
};

export default capsolver;