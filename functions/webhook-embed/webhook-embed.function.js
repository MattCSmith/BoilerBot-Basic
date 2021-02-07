const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = (client) => {

    /**
     * A client function to sent a webhook embed to a discord server the bot might now be a member of.
     * @param {String} url - Provide the URL the webhook should be sent too
     * @param {string} params - An object containing embed fields.
     * @param {string} verbosity - Enter a value between 1-5 for how important the log message are
     */
    client.sendWebhook = (url = "fallbackURL", params, verbosity = 1) => {

        client.defaultLog(verbosity, "PREPARING WEBHOOK", `Webhook request titled: '${params.title ? params.title : null}', has been recieved and is being prepared for sending!`)

        if (!params.thumbnail && params.authorAvatar) params.thumbnail = params.authorAvatar

        const colors = {
            green: 655104,
            orange: 16098851,
            red: 16711680,
        }

        const author = params.authorName ? {
            name: params.authorName,
            url: params.authorUrl ? params.authorUrl : null,
            icon_url: params.authorAvatar ? params.authorAvatar : null,
        } : null

        const thumbnail = params.thumbnail ? {
            url: params.thumbnail
        } : null

        const footer = params.footer ? params.footer : {
            text: client.user.username,
            icon_url: client.settings.general.botAvatar
        }

        const embed = [{
            title: params.title ? params.title : null,
            description: params.desc ? params.desc : "No Desc Provided!",
            color: params.color ? colors[params.color] : null,
            author: author,
            thumbnail: thumbnail,
            fields: params.fields ? params.fields : null,
            footer: footer
        }];



        fetch(client.settings.discordWebhookUrls["fallbackURL"], {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: client.user.username,
                avatar_url: client.settings.general.botAvatar,
                embeds: embed,
            }),
        })
            .then((result) => {
                client.defaultLog(verbosity, "WEBHOOK SENT", `Webhook request titled: '${params.title ? params.title : null}', Has been sent to ${url}`)
            })
            .catch((err) => { console.log("Webhook Error", err) });
    }
};
