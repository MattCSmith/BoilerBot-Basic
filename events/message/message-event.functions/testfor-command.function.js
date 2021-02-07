// This helper function handles:
// ➼ Testing for a command in the message body
// ➼ Executing any commands found

module.exports = async (client, message) => {
    client.defaultLog(1, "COMMAND TESTING", `Mentioned: ${message.mentions.users.first()} => Bot ID: ${client.user.id}`)

    // Test if bot was mentioned, return if it wasnt
    if (!message.mentions.users.first()) return;
    if (message.mentions.users.first().id !== client.user.id) return;

    // Breaks message up into an array, so we can test for commands and args
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[1];
    let args = messageArray.slice(2);

    if (client.commands.get(command)) client.commands.get(command).run(client, message, args);

    // Returns true, so we can stop the execution of the message event
    return true;
};
