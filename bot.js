const Discord = require("discord.js");
const minimist = require('minimist');

// Set Env path
require("dotenv").config({ path: __dirname + "/config/.env" });

// Prevent he bot from using @everyone
const client = new Discord.Client({ disableEveryone: true });

// Get Command line flags and set them to the event
client.cliFlags = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'verbosity'
    }
});

// Define the global settings
client.settings = require(`./config/settings.js`);

// Create a collection to store our commands in
client.commands = new Discord.Collection();

// Load our event, command and function handlers
client.eventHandler = require("./handlers/event.handler")(client);
client.functionHandler = require("./handlers/function.handler")(client);
client.commandHandler = require("./handlers/command.handler")(client);

client.login(process.env.DISCORD_TOKEN);
