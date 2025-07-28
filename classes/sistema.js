import { lerDados, escreverDados } from "../utils/utils.js";
import Cliente from "./cliente.js";
import Funcionario from "./funcionario.js";
import Reserva from "./reserva.js";
import Quarto from "./quarto.js";

// a classe sistema comporta todos os métodos essenciais para a utilização do programa
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

    login(cpf, senha){
        const dados = lerDados();

        // primeiro verifica se é funcionário
        const funcionarios = dados.funcionarios || {};
        for (const id in funcionarios) {
            if (funcionarios[id].cpf === cpf && funcionarios[id].senha === senha) {
                console.log("Funcionário logado com sucesso!");
                console.log(`Bem-vindo(a), ${funcionarios[id].nome}!`);
                
                return {
                    id: id,
                    nome: funcionarios[id].nome,
                    cpf: funcionarios[id].cpf,
                    email: funcionarios[id].email,
                    tipo: "funcionario"
                };
            }
        }

        // Se não encontrou nos funcionários, verifica nos clientes
        const clientes = dados.clientes || {};
        for (const id in clientes) {
            if (clientes[id].cpf === cpf && clientes[id].senha === senha) {
                console.log("Cliente logado com sucesso!");
                console.log(`Bem-vindo(a), ${clientes[id].nome}!`);
                
                return {
                    id: id,
                    nome: clientes[id].nome,
                    cpf: clientes[id].cpf,
                    email: clientes[id].email,
                    tipo: "cliente"
                };
            }
        }

        // Se chegou aqui, CPF ou senha estão incorretos
        console.log("CPF ou senha incorretos.");
        return null;
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

    // menu do funcionario - alterar status de reserva
    patchReserva(idCliente, novoStatus){
        const dados = lerDados();
        
        // status possiveis
        const statusValidos = ["ativa", "cancelada"];
        
        if (!statusValidos.includes(novoStatus)) {
            console.log(`Status inválido. Use: ${statusValidos.join(", ")}`);
            return;
        }

        // procura se o cliente tem reserva ativa
        for (const id in dados.reservas) {
            if (dados.reservas[id].idCliente === idCliente && dados.reservas[id].status === "ativa") {
                const statusAnterior = dados.reservas[id].status;
                dados.reservas[id].status = novoStatus;
                
                escreverDados(dados);
                console.log(`Status da reserva alterado de "${statusAnterior}" para "${novoStatus}"`);
                console.log(`Cliente: ${idCliente} | Quarto: ${dados.reservas[id].idQuarto}`);
                return;
            }
        }
        
        console.log(`Não foi encontrada reserva ativa para o cliente ${idCliente}`);
    }

    verReservas(idCliente){
        const dados = lerDados();
        // vamos guardar as reservas em uma lista
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

    getProfile(idUsuario, tipoUsuario){
        const dados = lerDados();

        let tabela, usuario;
        
        // mudanca para reconhecer automaticamente o tipo de usuario, se eh cliente ou funcionario
        if (tipoUsuario === "cliente") {
            tabela = dados.clientes;
        } else if (tipoUsuario === "funcionario") {
            tabela = dados.funcionarios;
        } else {
            console.log("Tipo de usuário inválido.");
            return null;
        }

        // Procura o usuário pelo ID na tabela correta
        if (tabela && tabela[idUsuario]) {
            usuario = tabela[idUsuario];
            
            console.log("=== SEU PERFIL ===");
            console.log(`Nome: ${usuario.nome}`);
            console.log(`Data de Nascimento: ${usuario.dataNascimento}`);
            console.log(`CPF: ${usuario.cpf}`);
            console.log(`Email: ${usuario.email}`);
            console.log("==================");
            
            return usuario;
        } else {
            console.log(`${tipoUsuario === "cliente" ? "Cliente" : "Funcionário"} não encontrado.`);
            return null;
        }
    }
}

export default Sistema;