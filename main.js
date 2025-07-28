import Sistema from "./classes/sistema.js";
import readline from "readline";

// configuração do readline para entrada do usuário (input/output)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// variável que vai armazenar quando o usuário está logado
let usuarioLogado = null;

// função para automatizar a pergunta ao usuário
function pergunta(questao) {
    return new Promise((resolve) => {
        rl.question(questao, (resposta) => {
            resolve(resposta);
        });
    });
}

// função para pausar e aguardar Enter
// interessante para o usuario conseguir ler tudo certinho
async function pausar() {
    await pergunta("\nPressione Enter para continuar...");
    console.clear();
}

// menu inicial (antes do login)
async function menuInicial() {
    console.clear();
    console.log("=== SISTEMA DE GERENCIAMENTO HOTELEIRO ===");
    console.log("1. Fazer Login");
    console.log("2. Cadastrar Cliente");
    console.log("3. Sair");
    console.log("==========================================");
    
    const opcao = await pergunta("Escolha uma opção: ");
    
    switch (opcao) {
        case "1":
            await fazerLogin();
            break;
        case "2":
            await cadastrarCliente();
            break;
        case "3":
            console.log("Obrigado por usar nosso sistema!");
            rl.close();
            return;
        default:
            console.log("Opção inválida!");
            await pausar();
            await menuInicial();
    }
}

// função de login
async function fazerLogin() {
    console.clear();
    console.log("=== LOGIN ===");
    
    const cpf = await pergunta("CPF: ");
    const senha = await pergunta("Senha: ");
    
    const sistema = new Sistema();
    usuarioLogado = sistema.login(cpf, senha);
    
    if (usuarioLogado) {
        await pausar();
        if (usuarioLogado.tipo === "cliente") {
            await menuCliente();
        } else if (usuarioLogado.tipo === "funcionario") {
            await menuFuncionario();
        }
    } else {
        await pausar();
        await menuInicial();
    }
}

// Função para cadastrar cliente
async function cadastrarCliente() {
    console.clear();
    console.log("=== CADASTRO DE CLIENTE ===");
    
    const nome = await pergunta("Nome completo: ");
    const dataNascimento = await pergunta("Data de nascimento (dd-mm-aaaa): ");
    const cpf = await pergunta("CPF: ");
    const email = await pergunta("Email: ");
    const senha = await pergunta("Senha: ");
    
    const sistema = new Sistema();
    sistema.createCliente(nome, dataNascimento, cpf, email, senha);
    
    await pausar();
    await menuInicial();
}



// Função para fazer reserva
async function fazerReserva() {
    console.clear();
    console.log("=== FAZER RESERVA ===");
    
    // Mostrar quartos disponíveis
    const quartos = Sistema.getQuartos();
    console.log("Quartos disponíveis:");
    for (const id in quartos) {
        if (quartos[id].qtdQuartosDisponiveis > 0) {
            console.log(`${id}. ${quartos[id].nome} - R$ ${quartos[id].precoNoite}/noite`);
        }
    }
    
    const idQuarto = await pergunta("\nID do quarto desejado: ");
    const dataEntrada = await pergunta("Data de entrada (dd-mm-aaaa): ");
    const dataSaida = await pergunta("Data de saída (dd-mm-aaaa): ");
    
    const sistema = new Sistema();
    sistema.createReserva(usuarioLogado.id, idQuarto, dataEntrada, dataSaida);
    
    await pausar();
    await menuCliente();
}

// Função para funcionário cadastrar cliente
async function cadastrarClienteFuncionario() {
    console.clear();
    console.log("=== CADASTRAR CLIENTE ===");
    
    const nome = await pergunta("Nome completo: ");
    const dataNascimento = await pergunta("Data de nascimento (dd-mm-aaaa): ");
    const cpf = await pergunta("CPF: ");
    const email = await pergunta("Email: ");
    const senha = await pergunta("Senha: ");
    
    const sistema = new Sistema();
    sistema.createCliente(nome, dataNascimento, cpf, email, senha);
    
}

// Função para cadastrar funcionário
async function cadastrarFuncionario() {
    console.clear();
    console.log("=== CADASTRAR FUNCIONÁRIO ===");
    
    const nome = await pergunta("Nome completo: ");
    const dataNascimento = await pergunta("Data de nascimento (dd-mm-aaaa): ");
    const cpf = await pergunta("CPF: ");
    const email = await pergunta("Email: ");
    const senha = await pergunta("Senha: ");
    
    const sistema = new Sistema();
    sistema.createFuncionario(nome, dataNascimento, cpf, email, senha);
    
}

// Função para adicionar quarto
async function adicionarQuarto() {
    console.clear();
    console.log("=== ADICIONAR QUARTO ===");
    
    const nome = await pergunta("Nome do quarto: ");
    const descricao = await pergunta("Descrição: ");
    const qtdCamas = parseInt(await pergunta("Quantidade de camas: "));
    const precoNoite = parseFloat(await pergunta("Preço por noite: R$ "));
    
    const sistema = new Sistema();
    sistema.createQuarto(nome, descricao, qtdCamas, precoNoite);
    
}

// Função para alterar status de reserva
async function alterarStatusReserva() {
    console.clear();
    console.log("=== ALTERAR STATUS DE RESERVA ===");
    
    // Mostrar reservas ativas
    const reservas = Sistema.getReservas();
    console.log("Reservas ativas:");
    for (const id in reservas) {
        if (reservas[id].status === "ativa") {
            console.log(`Cliente ID: ${reservas[id].idCliente} | Quarto: ${reservas[id].idQuarto}`);
            console.log(`Entrada: ${reservas[id].dataEntrada} | Saída: ${reservas[id].dataSaida}`);
            console.log("----------------------------");
        }
    }
    
    const idCliente = await pergunta("\nID do cliente: ");
    const novoStatus = await pergunta("Novo status (ativa/cancelada): ");
    
    const sistema = new Sistema();
    sistema.patchReserva(idCliente, novoStatus);
    
}

// Menu do cliente
async function menuCliente() {
    console.clear();
    console.log(`=== MENU CLIENTE - ${usuarioLogado.nome} ===`);
    console.log("1. Ver meu perfil");
    console.log("2. Ver quartos disponíveis");
    console.log("3. Fazer reserva");
    console.log("4. Ver minhas reservas");
    console.log("5. Cancelar reserva");
    console.log("6. Logout");
    console.log("=========================================");
    
    const opcao = await pergunta("Escolha uma opção: ");
    
    const sistema = new Sistema();
    
    switch (opcao) {
        case "1":
            console.clear();
            sistema.getProfile(usuarioLogado.id, usuarioLogado.tipo);
            await pausar();
            await menuCliente();
            break;
            
        case "2":
            console.clear();
            console.log("=== QUARTOS DISPONÍVEIS ===");
            const quartos = Sistema.getQuartos();
            for (const id in quartos) {
                if (quartos[id].qtdQuartosDisponiveis > 0) {
                    console.log(`ID: ${id} | ${quartos[id].nome}`);
                    console.log(`Descrição: ${quartos[id].descricao}`);
                    console.log(`Camas: ${quartos[id].qtd_camas} | Preço: R$ ${quartos[id].precoNoite}/noite`);
                    console.log(`Disponível: ${quartos[id].qtdQuartosDisponiveis} unidade(s)`);
                    console.log("----------------------------");
                }
            }
            await pausar();
            await menuCliente();
            break;
            
        case "3":
            await fazerReserva();
            break;
            
        case "4":
            console.clear();
            sistema.verReservas(usuarioLogado.id);
            await pausar();
            await menuCliente();
            break;
            
        case "5":
            console.clear();
            sistema.cancelReserva(usuarioLogado.id);
            await pausar();
            await menuCliente();
            break;
            
        case "6":
            usuarioLogado = null;
            await menuInicial();
            break;
            
        default:
            console.log("Opção inválida!");
            await pausar();
            await menuCliente();
    }
}


// Menu do funcionário
async function menuFuncionario() {
    console.clear();
    console.log(`=== MENU FUNCIONÁRIO - ${usuarioLogado.nome} ===`);
    console.log("1. Ver meu perfil");
    console.log("2. Ver lista de clientes");
    console.log("3. Ver lista de reservas");
    console.log("4. Ver lista de quartos");
    console.log("5. Cadastrar cliente");
    console.log("6. Cadastrar funcionário");
    console.log("7. Adicionar quarto");
    console.log("8. Alterar status de reserva");
    console.log("9. Logout");
    console.log("===========================================");
    
    const opcao = await pergunta("Escolha uma opção: ");
    
    const sistema = new Sistema();
    
    switch (opcao) {
        case "1":
            console.clear();
            sistema.getProfile(usuarioLogado.id, usuarioLogado.tipo);
            await pausar();
            await menuFuncionario();
            break;
            
        case "2":
            console.clear();
            console.log("=== LISTA DE CLIENTES ===");
            const clientes = Sistema.getClientes();
            for (const id in clientes) {
                console.log(`ID: ${id} | Nome: ${clientes[id].nome} | CPF: ${clientes[id].cpf}`);
            }
            await pausar();
            await menuFuncionario();
            break;
            
        case "3":
            console.clear();
            console.log("=== LISTA DE RESERVAS ===");
            const reservas = Sistema.getReservas();
            for (const id in reservas) {
                console.log(`ID: ${id} | Cliente: ${reservas[id].idCliente} | Quarto: ${reservas[id].idQuarto}`);
                console.log(`Entrada: ${reservas[id].dataEntrada} | Saída: ${reservas[id].dataSaida}`);
                console.log(`Status: ${reservas[id].status}`);
                console.log("----------------------------");
            }
            await pausar();
            await menuFuncionario();
            break;
            
        case "4":
            console.clear();
            console.log("=== LISTA DE QUARTOS ===");
            const quartos = Sistema.getQuartos();
            for (const id in quartos) {
                console.log(`ID: ${id} | ${quartos[id].nome} - R$ ${quartos[id].precoNoite}`);
                console.log(`Camas: ${quartos[id].qtd_camas} | Disponível: ${quartos[id].qtdQuartosDisponiveis}`);
                console.log("----------------------------");
            }
            await pausar();
            await menuFuncionario();
            break;
            
        case "5":
            await cadastrarClienteFuncionario();
            await pausar();
            await menuFuncionario();
            break;
            
        case "6":
            await cadastrarFuncionario();
            await pausar();
            await menuFuncionario();
            break;
            
        case "7":
            await adicionarQuarto();
            await pausar();
            await menuFuncionario();
            break;
            
        case "8":
            await alterarStatusReserva();
            await pausar();
            await menuFuncionario();
            break;
            
        case "9":
            usuarioLogado = null;
            await menuInicial();
            break;
            
        default:
            console.log("Opção inválida!");
            await pausar();
            await menuFuncionario();
    }
}



// Iniciar o sistema
console.log("Iniciando sistema...");
menuInicial();
