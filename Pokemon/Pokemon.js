
const {getPokemonSpeciesById, getNatureDataById} = require('../pokeService')

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
        this.nature = null
        this.gender = null
        this.ivs = []
        this.officialArt = this.pokemonData.sprites.other['official-artwork'].front_default
        this.stats = []


        this.setAbility()
        this.setMoves()
        this.setIvs()
        this.setGender()
        this.setStats()
    }

    async setStats() {
        const nature = await this.setNature()
        const baseStats = this.pokemonData.stats
        for (let i = 0; i < baseStats.length; i++) {
            let calculatedStat
            if (nature.increased_stat && baseStats[i].stat.name === nature.increased_stat.name) {
                calculatedStat = this.calculateFinalStat(baseStats[i].base_stat,this.ivs[i],this.level, i === 0 ? true : false, "Increase")
            }
            else if (nature.decreased_stat_stat && baseStats[i].stat.name === nature.decreased_stat.name) {
                calculatedStat = this.calculateFinalStat(baseStats[i].base_stat,this.ivs[i],this.level, i === 0 ? true : false, "Decrease")
            }
            else {
                calculatedStat = this.calculateFinalStat(baseStats[i].base_stat,this.ivs[i],this.level, i === 0 ? true : false)
            }

            this.stats.push(calculatedStat)
        }
    }

    calculateFinalStat(baseStat, iv, level, isHP,statChanged = null) {
        const base = Math.floor((2 * baseStat + iv ) * level / 100);
        let multiplier = 1.0;
        if (statChanged === "Increase") {
            multiplier = 1.1; // Aumenta em 10%
        } else if (statChanged === "Decrease") {
            multiplier = 0.9;
        }

        return isHP ? base + level + 10 : Math.floor((base + 5) * multiplier);
    }

    async setNature() {
        const idNature = Math.floor(Math.random() * 25) + 1
        const natureData = await getNatureDataById(idNature)
        this.nature = natureData
        return natureData
    }

    setIvs() {
        for (let i = 0; i < 6; i++) {
            const iv = Math.floor(Math.random() * 31) + 1
            this.ivs.push(iv)
        }
    }
    
    async setGender() {
        const pokeSpeciesData = await getPokemonSpeciesById(this.id)
        const genderRate = pokeSpeciesData.gender_rate
        const randomPercent = Math.floor(Math.random() * 8) + 1
        if (genderRate === -1) {
            this.gender = "Genderless"
        }
        else if (randomPercent <= genderRate) {
            this.gender = "Female"
        }
        else {
            this.gender = "Male"
        }
    }

    setAbility() {
        if (this.pokemonData.abilities && this.pokemonData.abilities.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.pokemonData.abilities.length);
            this.ability = this.pokemonData.abilities[randomIndex].ability.name;
        } else {
            this.ability = "Unknown"; 
        }
    }

    setMoves() {
        if (this.pokemonData.moves && this.pokemonData.moves.length > 0) {
            const shuffledMoves = this.pokemonData.moves
                .sort(() => Math.random() - 0.5) 
                .slice(0, 4)             
                .map(m => m.move.name);

            this.moves = shuffledMoves;
        } else {
            this.moves = ["Struggle"]; 
        }
    }

}

module.exports = Pokemon