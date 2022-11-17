//Importando para o projeto o Http
const http = require('http');

//Variavel para armazenar a porta | Caso a porta não estiver preenchida, pega a 3000
const port = process.env.PORT || 3000;

//cria o servidor
const server = http.createServer();
//Insere a porta no servidor
server.listen(port);


