const Discord = require('discord.js')
const DiscordServer = require('./User/DiscordServer')
let channelId = null

const discordServer = new DiscordServer()

const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.DirectMessages,
        Discord.IntentsBitField.Flags.GuildInvites,
        Discord.IntentsBitField.Flags.GuildMembers,
        Discord.IntentsBitField.Flags.GuildPresences,
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.MessageContent,
        Discord.IntentsBitField.Flags.GuildMessageReactions,
        Discord.IntentsBitField.Flags.GuildEmojisAndStickers,
        Discord.IntentsBitField.Flags.GuildVoiceStates,
        Discord.IntentsBitField.Flags.GuildMessages
    ],
    partials: [
        Discord.Partials.User,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember
    ]
})



channelId = "1318013852683599872"
const {spawnPokemon, activePokemon } = require('./Pokemon/wildPokemon.js')
const { capitalizeFirstLetter} = require('./Functionalities/capitalizer.js')

client.once('ready', async() => {
    console.log(`Bot online como ${client.user.tag}!`);

    //debug
    if (channelId) {
        spawnPokemon(client, channelId)
    }

});

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    let userMessage = message.content.toLowerCase()
    const userId = message.author.id
    if (userMessage === "!setchannel") {
        channelId = message.channelId
        await message.reply("Canal configurado")

        spawnPokemon(client, channelId)
    }
    if(userMessage === "!pokemons") {
        const user = discordServer.users.get(userId); 
        if (user) {
            await message.reply(user.listPokemons());
        } else {
            console.log("Usuário não encontrado!");
            await message.reply("You didn't catch any pokemon yet")
        }
    }

    const channelActivePokemons = activePokemon[message.channel.id];

    if (channelActivePokemons) {
        if (userMessage.startsWith('!catch')) {
            
            const pokemonName = userMessage.split(" ")[1];
            const activePokemon = channelActivePokemons?.find((p) => p.name === pokemonName);
            username = capitalizeFirstLetter(message.author.username)
            
           
            if (activePokemon) {
                const user = discordServer.addUser(username, userId)
                
                clearTimeout(activePokemon.timeout);

                activePokemon.captured = true;
                user.catchPokemon(activePokemon)
                
                const embed = new Discord.EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle(`${username} captured a/an ${capitalizeFirstLetter(pokemonName)}! 🎉`) 
                    .setDescription(`**Details:**\n` +
                        `Nature: ${capitalizeFirstLetter(activePokemon.nature.name)}\n` +
                        `Gender: ${activePokemon.gender}\n` +
                        `Level: ${activePokemon.level}\n` +
                        `\n` +
                        `**Stats**\n` +
                        `**HP**: ${activePokemon.stats[0]} - IV: ${activePokemon.ivs[0]}/31\n` +
                        `**Attack**: ${activePokemon.stats[1]} - IV: ${activePokemon.ivs[1]}/31\n` +
                        `**Defense**: ${activePokemon.stats[2]} - IV: ${activePokemon.ivs[2]}/31\n` +
                        `**Sp. Atk**: ${activePokemon.stats[3]} - IV: ${activePokemon.ivs[3]}/31\n` +
                        `**Sp. Def**: ${activePokemon.stats[4]} - IV: ${activePokemon.ivs[4]}/31\n` +
                        `**Speed**: ${activePokemon.stats[5]} - IV: ${activePokemon.ivs[5]}/31`
                    )
                    .setImage(activePokemon.officialArt)
                    .setTimestamp();

                await message.reply({ embeds: [embed] });
                console.log(`${message.author.username} capturou o Pokémon ${pokemonName}.`);

                delete activePokemon;
            }
        }
    }

});



const config = require('./config')
client.login(config.discord.token)

process.on('unhandledRejection', (reason, p) => {
  console.error('[ Event Error: unhandledRejection ]', p, 'reason:', reason)
})
process.on("uncaughtException", (err, origin) => {
  console.error('[ Event Error: uncaughtException ]', err, origin)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('[ Event Error: uncaughtExceptionMonitor ]', err, origin);
})

module.exports = client