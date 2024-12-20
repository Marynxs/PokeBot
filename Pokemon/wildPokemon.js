const { getPokemonById, checkPokemonRarity, isPseudoLegendary, getPokemonSpeciesById} = require('../pokeService');
const {capitalizeFirstLetter} = require('../Functionalities/capitalizer')
const Discord = require('discord.js')

const activePokemon = {}

async function sendWildPokemon(channel, despawnTime , pokemonData ) {
                
    const embed = new Discord.EmbedBuilder()
    .setColor(0xf00000) 
    .setTitle('A WILD POKÉMON HAS APPEARED')
    .setImage(pokemonData.sprites.other['official-artwork'].front_default)
    .addFields({ 
        name: '\u200B',
        value: `**${pokemonData.name.toUpperCase()}**`, 
        inline: false
    })
    .addFields(
        { name: 'Tipe(s)', value: pokemonData.types.map(t => t.type.name).join(', '), inline: true },
        { name: 'Ability(s)', value: pokemonData.abilities.map(a => a.ability.name).join(', '), inline: true},
        { name: 'Height', value: `${pokemonData.height / 10} m`, inline: true },
        { name: 'Weight', value: `${pokemonData.weight / 10} kg`, inline: true },
        { name: 'Time to flee', value: `${Math.ceil(despawnTime / 1000)} seconds`, inline: true}
    )
    .setTimestamp();

    try {
        channel.send({ embeds: [embed] });
    } catch {
        console.error(`Canal ${channel} não encontrado.`);
    }

}

function timeoutToDespawn() {
    const mean = 30;
    const stdDev = 10; 
    despawnTime = Math.max(3, randomNormal(mean, stdDev)); 
    despawnTime = Math.round(despawnTime * 1000); 

    console.log(`O Pokémon ${pokemonName} irá fugir em ${(despawnTime / 1000).toFixed(2)} segundos.`);
    return despawnTime;

}

async function spawnPokemon(client, channelId) {

    try{
        const channel = await client.channels.fetch(channelId);
                
        console.log(`${channel}`)
        setInterval(async () => {
            let randomPokemonId
            let pokemonRarity 
            let isPseudo
            let pokemonData

            while(true) {
                randomPokemonId = getRandomizePokemon(); 
                pokemonData = await getPokemonById(randomPokemonId)
                pokemonSpeciesData = await getPokemonSpeciesById(randomPokemonId)
                pokemonName = pokemonData.name
                pokemonRarity = await checkPokemonRarity(pokemonSpeciesData)
                isPseudo = await isPseudoLegendary(pokemonSpeciesData)

                if (pokemonRarity === "normal") {
                    const chance = Math.random() * 100;
                    if (isPseudo && chance <= 50) {
                        console.log(`Spawnando pseudolendario :  ${pokemonName}`)
                        break
                    }
                    else if (isPseudo) {
                        console.log(`O Pseudolendario ${pokemonName} não passou de 40%, sorteando novamente.`);
                        continue
                    }
                    else {
                        console.log(`Spawnando Pokémon normal: ${pokemonName}`);
                        break
                    }
                }
                else {
                    const chance = Math.random() * 100;
                    if (chance <= 15.38) {
                        console.log(`Spawnando Pokémon raro com 1% de chance:  ${pokemonName}`);
                        break
                    } else {
                        console.log(`Pokémon raro (${pokemonName}) não passou no 1% de chance, sorteando novamente.`);
                        continue
                    }
                }
            }

            let despawnTime = timeoutToDespawn()
            await sendWildPokemon(channel, despawnTime, pokemonData);
            const timeout = setTimeout(async () => {
                const active = activePokemon[channelId]?.find((p) => p.id === randomPokemonId);
                if (active && !active.captured) {
                    await despawnPokemon(channel, pokemonData);
                    removeActivePokemon(channelId, randomPokemonId);
                }
            }, despawnTime);
            addActivePokemon(channelId, pokemonData, timeout);
             


        }, 5000);

    } catch (error) {
        console.error('Erro ao buscar o canal:', error.message);
    }
}

const Pokemon = require('./Pokemon');

function addActivePokemon(channelId, pokemonData, timeout) {
    if (!activePokemon[channelId]) {
        activePokemon[channelId] = [];
    }
    activePokemon[channelId].push(
        new Pokemon(pokemonData,timeout)
    )
}

function removeActivePokemon(channelId, pokemonId) {
    if (activePokemon[channelId]) {
        activePokemon[channelId] = activePokemon[channelId].filter((pokemon) => pokemon.id !== pokemonId);

        if (activePokemon[channelId].length === 0) {
            delete activePokemon[channelId];
        }
    }
}


const randomNormal = (mean, stdDev) => {
    let u1 = Math.random();
    let u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z * stdDev;
};


async function despawnPokemon(channel, pokemonData) {
    const pokemonName = pokemonData.name

    const embed = new Discord.EmbedBuilder()
    .setColor(0xff0000) 
    .setTitle(`${capitalizeFirstLetter(pokemonName)} fled!`)
    .setDescription("You weren't fast enough to catch it.")
    .setTimestamp();

    await channel.send({ embeds: [embed] });
    console.log(`O Pokémon ${pokemonName} fugiu.`);
}


function getRandomizePokemon() {
    const totalPokemons = 1025
    const randomPokemon = Math.floor(Math.random() * totalPokemons) + 1
    console.log(randomPokemon)
    return randomPokemon
} 

module.exports = { sendWildPokemon, getRandomizePokemon, spawnPokemon, activePokemon }