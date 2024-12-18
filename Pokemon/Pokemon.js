

class Pokemon{
    constructor(pokemonData, timeout){
        this.pokemonData = pokemonData
        this.name = pokemonData.name
        this.id = pokemonData.id
        this.captured = false
        this.ability = null
        this.moves = []
        this.level = Math.floor(Math.random() * 100) + 1
        this.types = pokemonData.types.map(t => t.type.name);
        this.timeout = timeout

        this.setAbility()
        this.setMoves()
    }

    setAbility() {
        if (this.pokemonData.abilities && this.pokemonData.abilities.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.pokemonData.abilities.length);
            this.ability = this.pokemonData.abilities[randomIndex].ability.name;
        } else {
            this.ability = "Unknown"; // Fallback caso não tenha habilidades
        }
    }

    setMoves(maxMoves = 4) {
        if (this.pokemonData.moves && this.pokemonData.moves.length > 0) {
            // Seleciona movimentos aleatórios
            const shuffledMoves = this.pokemonData.moves
                .sort(() => Math.random() - 0.5) // Embaralha os movimentos
                .slice(0, maxMoves)             // Pega os primeiros `maxMoves` movimentos
                .map(m => m.move.name);

            this.moves = shuffledMoves;
        } else {
            this.moves = ["Struggle"]; // Fallback caso não tenha movimentos
        }
    }

}

module.exports = Pokemon