module.exports = (client) => {
    // Creates a wait function. Used in /events/ready.js
    client.wait = require("util").promisify(setTimeout);
};
