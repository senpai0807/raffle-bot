import got from 'got';

async function sendWebhook(email, webhookURL) {
    const username = 'Lunar Scripts';
    const avatarUrl = 'https://imgur.com/Vn4CEtQ.png';
    const embed = {
        username,
        avatar_url: avatarUrl,
        embeds: [{
            title: 'Successful Entry 🌙',
            color: 5662170,
            thumbnail: { 
                url: avatarUrl 
            },
            fields: [
                {
                    name: "Email",
                    value: email,
                    inline: false
                }
            ],
            footer: {
                text: "Lunar Scripts",
                icon_url: avatarUrl
            },
            timestamp: new Date().toISOString()
        }]
    };

    const response = await got.post(webhookURL, {
        json: embed,
        responseType: 'json'
    });
};

export default sendWebhook;