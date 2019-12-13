const commands = [];

function register(command, handler, modOnly = false) {
    commands.push({
        command,
        handler,
        modOnly
    });
}

/**
 * Handles incoming messages
 *
 * @param {Message} msg
 */
function handle(msg) {
    const content = msg.content;

    if (content.startsWith('!')) {
        const [command, ...args] = content.substring(1).split(' ');

        const handler = commands.find(cmd =>
            cmd.command === command && (!cmd.modOnly || msg.member.roles.some(r => r.name === 'Mod')));

        if (handler) {
            handler.handler(msg, args.join(' '), args);
        }
    }
}

module.exports.handle = handle;
module.exports.register = register;
