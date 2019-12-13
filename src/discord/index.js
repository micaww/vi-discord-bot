const Discord = require('discord.js');
const commandHandler = require('./commands/util').handle;

require('./commands');

const client = new Discord.Client();

client.on('message', commandHandler);

function init(token) {
    return new Promise((resolve, reject) => {
        client.on('ready', resolve);
        client.on('error', reject);
        client.login(token);
    });
}

module.exports = init;
