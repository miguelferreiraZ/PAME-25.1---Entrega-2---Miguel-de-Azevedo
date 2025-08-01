// puxamos os 2 modulos nativos:
// fs: mexer com arquivos do sistema (file system)
// path: manipula arquivos, podemos pensar que cumpre a mesma funcao que os.path

// entao fs se assemelha a os do python
// path == path do python

// o import eh a sintaxe ES6 modules (mais moderna)
import fs from "fs";
import path from "path";

// caminho para o json (banco de dados)
const dbPath = path.join("database/data.json");


function lerDados() {
    // readFileSync retorna uma string do db
    const dbBruto = fs.readFileSync(dbPath, "utf-8");

    // JSON.parse transforma a string em um objeto do Js
    return JSON.parse(dbBruto);
}

function escreverDados(data) {
    // writeFileSync escreve diretamente no arquivo de forma sincronizada
    // JSON.stringfy eh o contrario do JSON.parse, ele transforma o objeto Js para string JSON
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export { lerDados, escreverDados };
