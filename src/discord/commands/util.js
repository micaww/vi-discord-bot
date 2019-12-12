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

    if (content.startsWith('!') && msg.member.roles.some(r => r.name === "Mod")) {
        const [command, ...args] = content.substring(1).split(' ');

        const handler = commands.find(cmd => {
            return cmd.command === command;
        });

        if (handler) {
            handler.handler(msg, args.join(' '), args);
        }
    }
}

module.exports.handle = handle;
module.exports.register = register;