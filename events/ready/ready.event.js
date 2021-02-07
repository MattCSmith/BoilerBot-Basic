/**
 * The ready event is emiited when the client becomes ready to start working
 * Eg, Once the bot logs into Discord the following will be executed. 
*/

module.exports = async (client) => {

    // Logs the CLI Flags provided on start up in the CLI
    client.systemLog(0, "CLI FLAGS", client.cliFlags)

    // Log when the bot is ready and online
    client.systemLog(0, "READY", `${client.user.username} is now online`);

    // Try to log a link to invite the bot to your server of choice
    try {
        let link = await client.generateInvite();
        client.systemLog(0, "INVITE LINK", link)
    } catch (e) {
        client.errorLog(0, "READY EVENT", e.stack, true)
    }

    // Fetch a list of the guilds channels and attach them to the client obj
    client.channelList = {};
    client.channels.cache.map((channel) => {
        if (channel.type !== "text") return;
        client.channelList[channel.name] = channel;
    });

};
