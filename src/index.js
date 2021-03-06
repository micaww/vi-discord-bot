const config = require('./config.json');
const Discord = require('./discord');

const token = config.discord.token;

if (!token) throw new Error('Discord token is missing.');

console.log('Connecting...');

Discord(token).then(async () => {
    console.log('Connected to Discord');
}).catch(err => {
    console.error('Unable to connect to Discord', err);
});
