const config = require('./config.json');
const Discord = require('./discord');

const token = config.token;

if (!token) throw new Error('Discord token is missing.');

Discord(config.token).then(async () => {
    console.log('Connected to Discord');
}).catch(err => {
    console.error('Unable to connect to Discord', err);
});