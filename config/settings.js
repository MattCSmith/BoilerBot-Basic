/**
  * The settings Object is designed to contain global settings
  * and is available via 'client.settings'
*/

const settings = {
    general: {
        botToken: process.env.token,
        botName: "BoilerBot - Basic",
        botAvatar: "https://robohash.org/2DG.png?set=set3&size=150x150",
    },
    discordWebhookUrls: {
        fallbackURL: process.env.FALLBACK_WEBHOOKURL,
    }
};

module.exports = settings;
