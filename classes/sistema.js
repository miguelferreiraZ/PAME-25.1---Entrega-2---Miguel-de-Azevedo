import { lerDados, escreverDados } from "../utils/utils.js";
import Cliente from "./cliente.js";
import Funcionario from "./funcionario.js";

// funcionario:
// - ver meus dados <getProfile> (quando eu logar, salvo o json do usuario em uma variável SEMPRE)
// - ver lista de reservas (getReservas)
// - ver lista de quartos (mesmo pros 2) (getQuartos)
// - ver lista de clientes (getClientes)
// - mudar status da reserva (pendente, adiada, realizada, cancelada) (setReserva)
// - adicionar quarto (addQuarto)
// - fazer cadastro funcionário (minha opinião) (loginFuncionario)


// cliente:
// - ver meus dados (getProfile)
// - ver lista de quartos (mesmo pros 2) (getQuartos)
// - fazer reserva (como fazer isso?)
// - cancelar reserva (como fazer isso?)
// - ver minhas reservas ()


// inicio:
// - fazer login (cpf e senha)
// - fazer cadastro (cliente)


class Sistema {
    constructor() {
    }

    static getClientes() {
        // ver lista de clientes
    }

    static getReservas() {
        // json of all reservations
    }

    static getQuartos() {
        // json of all rooms
    }

    static getFuncionarios() {
        // json of all employees
    }

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