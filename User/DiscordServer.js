const User = require('./User')
class DiscordServer {
    constructor() {
        this.users = new Map()
        this.nextUserId = 0
    }

    addUser(username, userId) {
        if (!this.users.has(userId)) {
            const newUser = new User(username, userId); 
            this.users.set(userId, newUser);
            console.log(`Usuário ${username} adicionado ao servidor com ID ${userId}`);
            return newUser
        }
        else {
            return this.getUser(userId)
        }
    }


    removeUser(userId) {
        if (this.users.has(userId)) {
            this.users.delete(userId);
            console.log(`Usuário com ID ${userId} removido do servidor `);
        }
    }

    getUser(userId) {
        return this.users.get(userId);
    }


    listUsers() {
        return Array.from(this.users.values());
    }
}

module.exports = DiscordServer