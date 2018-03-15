const scrape = require('../services/pubg.service');
const sql = require('../services/sql.service');

exports.run = run;
let help = exports.help = {
    name: 'addUser',
    description: 'Adds a user to the server\'s registery.',
    usage: '<prefix>addUser <pubg username>',
    examples: [
        '!pubg-addUser john'
    ]
};

async function run(bot, msg, params) {
    let username = params[0].toLowerCase();
    if(username === ''){
        msg.channel.send('Error: Must specify a username - Usage: ' + help.usage);   
        return;
    }

    msg.channel.send('Checking for ' + username + '\'s PUBG Id ... give me a second')
        .then(async (message) => {
            let pubgId = await scrape.getCharacterID(username);
        
            if (pubgId && pubgId !== '') {
                let registered = await sql.registerUserToServer(pubgId, message.guild.id);
                if(registered) {
                    message.edit('Added ' + username);
                } else {
                    message.edit('Could not add ' + username);
                }
                
            } else {
                message.edit('Invalid username: ' + username);
            }
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
};