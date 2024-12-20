const axios = require('axios')

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2"

async function getPokemonByName(name) {
    try {
        const response = await axios.get(`${POKE_API_BASE_URL}/pokemon/${name}/`)
        return response.data
    }
    catch (error) {
        console.error('Erro ao buscar Pokémon por Nome:', error.message);
        throw error;
    }
}

async function getPokemonById(id) {
    try {
        const response = await axios.get(`${POKE_API_BASE_URL}/pokemon/${id}/`)
        return response.data
    }
    catch (error) {
        console.error('Erro ao buscar Pokémon por ID:', error.message);
        throw error;
    }
}

async function getPokemonSpeciesById(id) {
    try {
        const response = await axios.get(`${POKE_API_BASE_URL}/pokemon-species/${id}/`)
        return response.data
    }
    catch (error) {
        console.error('Erro ao buscar Pokémon por ID:', error.message);
        throw error;
    }
}

async function getNatureDataById(id) {
    try {
        const response = await axios.get(`${POKE_API_BASE_URL}/nature/${id}/`)
        return response.data
    }
    catch (error) {
        console.error('Erro ao buscar Pokémon por ID:', error.message);
        throw error;
    }
}

async function checkPokemonRarity(pokemonSpeciesData) {
    try {

        if (pokemonSpeciesData.is_legendary) {
            return "legendary";
        } else if (pokemonSpeciesData.is_mythical) {
            return "mythical";
        } else {
            return "normal";
        }
    } catch (error) {
        console.error(`Erro ao buscar informações da Raridade do Pokemon : ${error.message}`);
        return null;
    }
}

async function isPseudoLegendary(pokemonSpeciesData) {
    try {
        // Passo 1: Buscar a espécie do Pokémon e a cadeia evolutiva
        const evolutionChainUrl = pokemonSpeciesData.evolution_chain.url;
        const evolutionResponse = await axios.get(evolutionChainUrl);
        const evolutionChain = evolutionResponse.data.chain;

        // Função recursiva para contar os estágios na cadeia evolutiva
        const countEvolutionStages = (chain) => {
            let stages = 1;
            let currentStage = chain;
            
            while (currentStage.evolves_to.length > 0) {
                if (currentStage.evolves_to.length > 1) {
                    console.warn("Cadeia evolutiva possui ramificações (não suportado).");
                }
                stages++;
                currentStage = currentStage.evolves_to[0];
            }
            return stages;
        };

        // Função recursiva para verificar Base Stats de toda a cadeia
        const checkBaseStatsInChain = async (chain) => {
            const speciesUrl = chain.species.url;
            const speciesId = speciesUrl.split('/').filter(Boolean).pop(); // Extrai o ID da URL

            // Buscar os Base Stats do Pokémon
            const pokemonResponse = await axios.get(`${POKE_API_BASE_URL}/pokemon/${speciesId}`);
            const totalStats = pokemonResponse.data.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

            if (totalStats === 600) {
                return true; // Encontra um pseudo-lendário na cadeia
            }

            // Percorrer próximos estágios evolutivos
            for (const evolution of chain.evolves_to) {
                if (await checkBaseStatsInChain(evolution)) {
                    return true;
                }
            }

            return false; // Nenhum Pokémon na cadeia tem 600 de Base Stats
        };

        // Passo 2: Verificar os estágios e os Base Stats
        const totalStages = countEvolutionStages(evolutionChain);
        const hasPseudoLegendary = await checkBaseStatsInChain(evolutionChain);

        // Um Pokémon é pseudo-lendário se tiver 3 estágios e pelo menos 1 com Base Stats = 600
        const isPseudo = totalStages === 3 && hasPseudoLegendary;

        if (isPseudo) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error(`Erro ao buscar informações de PseudoLendario: ${error.message}`);
        return false;
    }
}

module.exports = { getPokemonByName, getPokemonById, checkPokemonRarity , isPseudoLegendary, getPokemonSpeciesById, getNatureDataById};