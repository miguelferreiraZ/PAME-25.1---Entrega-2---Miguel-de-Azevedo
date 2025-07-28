import { lerDados, escreverDados } from "../utils/utils.js";
import Cliente from "./cliente.js";
import Funcionario from "./funcionario.js";
import Reserva from "./reserva.js";
import Quarto from "./quarto.js";

// funcionario:
// - ver meus dados <getProfile> (quando eu logar, salvo o json do usuario em uma variável SEMPRE)
// - ver lista de reservas (getReservas) <>
// - ver lista de quartos (mesmo pros 2) (getQuartos) <>
// - ver lista de clientes (getClientes) <>
// - mudar status da reserva (pendente, adiada, realizada, cancelada) (setReserva)
// - adicionar quarto (createQuarto) <>
// - fazer cadastro funcionário (minha opinião) (createFuncionario) <>


// cliente:
// - ver meus dados (getProfile)
// - ver lista de quartos (mesmo pros 2) (getQuartos) <>
// - fazer reserva (como fazer isso?) <>
// - cancelar reserva (como fazer isso?) <>
// - ver minhas reservas () 


// inicio:
// - fazer login (cpf e senha)
// - fazer cadastro (cliente)


class Sistema {
    constructor() {
    }

    static getClientes() {
        const dados = lerDados();
        return dados.clientes || {};
    }

    static getReservas() {
        const dados = lerDados();
        return dados.reservas || {};
    }

    static getQuartos() {
        const dados = lerDados();
        return dados.quartos || {};
    }

    static getFuncionarios() {
        const dados = lerDados();
        return dados.funcionarios || {};
    }

    // menu do funcionario
    createQuarto(nome, descricao, qtdCamas, precoNoite){
        const dados = lerDados();

        if (!dados.quartos) {
            dados.quartos = {};
        }

        // verifica se já existe um quarto com o mesmo nome
        for (const id in dados.quartos) {
            if (dados.quartos[id].nome === nome) {
                console.log(`Quarto com nome "${nome}" já existe, adicionando mais 1 à quantidade.`);
                dados.quartos[id].qtdQuartosDisponiveis += 1;
                escreverDados(dados);
                return;
            }
        }

        // cria um novo quarto (sem parâmetro qtdQuartosDisponivel)
        const novoQuarto = new Quarto(nome, descricao, qtdCamas, precoNoite);

        // salva o quarto no formato do bd
        dados.quartos[String(novoQuarto.id)] = {
            nome: novoQuarto.nome,
            descricao: novoQuarto.descricao,
            qtd_camas: novoQuarto.qtdCamas,
            precoNoite: novoQuarto.precoNoite,
            qtdQuartosDisponiveis: novoQuarto.qtdQuartosDisponivel
        };

        escreverDados(dados);
        console.log(`Quarto "${nome}" criado com sucesso (ID: ${novoQuarto.id})`);
    }

    // menu do cliente
    createReserva(idCliente, idQuarto, dataEntrada, dataSaida){
        const dados = lerDados();

        if (!dados.reservas) {
            dados.reservas = {};
        }

        // aqui verificamos se o quarto existe
        if (!dados.quartos[idQuarto]) {
            console.log(`Quarto ${idQuarto} não existe`);
            return;
        }

        // verifica se o quarto já está reservado (verificando nas reservas ativas)
        for (const id in dados.reservas) {
            if (dados.reservas[id].idQuarto === idQuarto && dados.reservas[id].status === "ativa") {
                console.log(`Quarto ${idQuarto} já está reservado`);
                return;
            }
        }


        const novaReserva = new Reserva(idCliente, idQuarto, dataEntrada, dataSaida);
        
        dados.reservas[novaReserva.id] = {
            idCliente: novaReserva.idCliente,
            idQuarto: novaReserva.idQuarto,
            dataEntrada: novaReserva.dataEntrada,
            dataSaida: novaReserva.dataSaida,
            status: novaReserva.status
        };

        escreverDados(dados);
        console.log(`Reserva criada com sucesso (ID: ${novaReserva.id})`);
    }

    // tecnicamente o usuario so pode fazer uma reserva por vez
    // entao eu posso simplesmente receber o idCliente e mudar o status da reserva que esta no ID dele
    cancelReserva(idCliente){
        const dados = lerDados();

        for (const id in dados.reservas) {
            if (dados.reservas[id].idCliente === idCliente && dados.reservas[id].status === "ativa") {
                dados.reservas[id].status = "cancelada";
                escreverDados(dados);
                console.log(`Reserva do quarto ${dados.reservas[id].idQuarto} cancelada com sucesso`);
                return;
            }
        }
        console.log(`Você não possui nenhuma reserva em seu nome`);
    }

    verReservas(idCliente){
        const dados = lerDados();
        const reservasCliente = [];

        for(const id in dados.reservas){
            if (dados.reservas[id].idCliente === idCliente) {
                reservasCliente.push({
                    id: id,
                    idQuarto: dados.reservas[id].idQuarto,
                    dataEntrada: dados.reservas[id].dataEntrada,
                    dataSaida: dados.reservas[id].dataSaida,
                    status: dados.reservas[id].status
                });
            }
        }

        if (reservasCliente.length === 0) {
            console.log("Você não possui nenhuma reserva.");
            return [];
        }

        console.log("Suas reservas:");
        reservasCliente.forEach(reserva => {
            console.log(`- Quarto ${reserva.idQuarto}: ${reserva.dataEntrada} a ${reserva.dataSaida} (${reserva.status})`);
        });

        return reservasCliente;
    }

    // menu do funcionario
    createCliente(nome, dataNascimento, cpf, email, senha){
        // ler o banco de dados
        const dados = lerDados();

        // verifica se o dados.clientes existe, senao cria
        if (!dados.clientes){
            dados.clientes = {};
        }

        // verifica se o cliente ja existe
        for (const id in dados.clientes) {
            if (dados.clientes[id].cpf === cpf) {
                console.log(`Cliente com CPF ${cpf} já cadastrado.`);
                return;
            }
        }

        // cria um novo cliente, lembrando que o id ja foi gerado automaticamente
        const novoCliente = new Cliente(nome, dataNascimento, cpf, email, senha);

        // aqui pegamos da parte de clientes do json, a chave é o id do cliente
        // e cria um novo objeto com os dados do cliente
        // assim, o cliente fica armazenado no json
        dados.clientes[String(novoCliente.id)] = {
            nome: novoCliente.nome,
            dataNascimento: novoCliente.dataNascimento,
            cpf: novoCliente.cpf,
            email: novoCliente.email,
            senha: novoCliente.senha
        };


        escreverDados(dados);
        console.log(`Cliente ${nome} cadastrado com sucesso (ID: ${novoCliente.id})`);

    }
    
    // menu do funcionario
    createFuncionario(nome, dataNascimento, cpf, email, senha){
        const dados = lerDados();

        if (!dados.funcionarios) {dados.funcionarios = {}}

        // verifica se o funcionario ja esta cadastrado no sistema
        for (const id in dados.funcionarios) {
            if (dados.funcionarios[id].cpf === cpf) {
                console.log(`Funcionario com CPF ${cpf} já cadastrado.`);
                return;
            }
        }

        const novoFuncionario = new Funcionario(nome, dataNascimento, cpf, email, senha);

        dados.funcionarios[String(novoFuncionario.id)] = {
            nome: novoFuncionario.nome,
            dataNascimento: novoFuncionario.dataNascimento,
            cpf: novoFuncionario.cpf,
            email: novoFuncionario.email,
            senha: novoFuncionario.senha
        }

        escreverDados(dados);
        console.log(`Funcionario ${nome} cadastrado com sucesso (ID: ${novoFuncionario.id})`);
    }
}

export default Sistema;