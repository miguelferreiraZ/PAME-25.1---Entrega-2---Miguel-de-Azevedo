class Cliente {
    constructor(nome, dataNascimento, cpf, email, senha) {
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.id = Cliente.generateId();
    }

    static generateId() {
        if (!this.last_id) {
            this.last_id = 0;
        }
        this.last_id++;
        return this.last_id;
    }

}

export default Cliente;