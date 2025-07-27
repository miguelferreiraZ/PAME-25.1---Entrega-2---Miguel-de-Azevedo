class Reserva {
    constructor(idCliente, idQuarto, dataEntrada, dataSaida) {
        this.idCliente = idCliente;
        this.idQuarto = idQuarto;
        this.dataEntrada = dataEntrada;
        this.dataSaida = dataSaida;
        this.status = 'ativa';
        this.id = Reserva.generateId();
    }
    static generateId() {
        if (!this.last_id) {
            this.last_id = 0;
        }
        this.last_id++;
        return this.last_id;
    }

}

export default Reserva;