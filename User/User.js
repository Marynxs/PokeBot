class User {
    constructor(username, id) {
        this.id = id
        this.username = username
        this.pokemons = []
        this.pokedex = []
        this.qtdPokemons = 0
    }

    catchPokemon(pokemon) {
        this.pokemons.push(pokemon)
        if (!this.pokedex.includes(pokemon.name)) {
            this.pokedex.push(pokemon.name);
        }
        this.qtdPokemons++
    }

    listPokemons() {
        if (this.pokemons.length === 0) {
            return `You didn't catch any pokemon yet`;
        }
        const pokemonNames = this.pokemons.map(pokemon => pokemon.name);
        return `You have the followed Pokemons: ${pokemonNames.join(', ')}`;
    }
}



module.exports = User