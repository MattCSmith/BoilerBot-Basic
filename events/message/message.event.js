const { testforCommand } = require("./message-event.functions/index");

/**
 * This event is triggered on every message sent in a channel the bot has access to
 * We want the bot to do the following on each message:
 * ➼ Ignore message from other bots
 * ➼ Check if it has been mentioned with a command
 * ➼ Otherwise handle the message or DM
*/

module.exports = async (client, message) => {

    // Ignore messages sent by other bots
    if (message.author.bot) return;

    // This will test the message for commands and execute them
    // If it is a cmd we want to stop the execution of the message event
    const isCmd = await testforCommand(client, message);
    if (isCmd) return;

    // Direct Message Handler
    // if (message.channel.type === "dm") console.log("DM MESSAGE")

    // Public Message Handler
    if (message.channel.type !== "dm") {
    }
};
