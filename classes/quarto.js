class Quarto {
    constructor(nome, descricao, qtdCamas, precoNoite) {
        this.nome = nome;
        this.descricao = descricao;
        this.qtdCamas = qtdCamas;
        this.precoNoite = precoNoite;
        this.qtdQuartosDisponiveis = 1;
        this.id = Quarto.generateId();
    }

    static generateId() {
        if (!this.last_id) {
            this.last_id = 0;
        }
        this.last_id++;
        return this.last_id;
    }
}

export default Quarto;