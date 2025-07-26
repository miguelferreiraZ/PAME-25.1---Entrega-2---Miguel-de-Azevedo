class Quarto {
    constructor(qtdCamas, precoNoite, qtdQuartosDisponivel, nome, descricao) {
        this.qtdCamas = qtdCamas;
        this.precoNoite = precoNoite;
        this.qtdQuartosDisponivel = qtdQuartosDisponivel;
        this.nome = nome;
        this.descricao = descricao;
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