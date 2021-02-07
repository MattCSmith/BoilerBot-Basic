
/**
 * A simple bot command that upon execution returns the bots latency
 * @param {Object} client - The bots global client obj.
 * @param {Object} message - The Discord message object.
 * @param {Array} args - An array of the arguments the user provided.
 * @returns {String} - Returns the latency of the command as a string. 
*/
exports.run = async (client, message, args) => {
    const msg = await message.channel.send("Ping?");
    msg.edit(
        `Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(
            client.ws.ping
        )}ms ${args}`
    );
};

exports.meta = {
    name: "ping"
};
