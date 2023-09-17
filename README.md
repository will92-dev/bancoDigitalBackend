
# Banco Digital Cubos Academy

Fui contratado pela melhor empresa de tecnologia do mundo: a CUBOS. Minha primeira tarefa como desenvolvedor é criar uma API para um Banco Digital. Esse será um projeto piloto, ou seja, no futuro outras funcionalidades serão implementadas, portanto, dados do banco (nome, agência, etc.) serão imutáveis.

## Funcionalidades

É uma RESTful API que permite:

- Criar conta bancária POST /contas
- Listar contas bancárias GET /contas?senha_banco=Cubos123Bank
- Atualizar os dados do usuário da conta bancária PUT /contas/:numeroConta/usuario
- Excluir uma conta bancária DELETE /contas/:numeroConta
- Depósitar em uma conta bancária POST /transacoes/depositar
- Sacar de uma conta bancária POST /transacoes/sacar
- Transferir valores entre contas bancárias POST /transacoes/transferir
- Consultar saldo da conta bancária GET /contas/saldo?numero_conta=123&senha=123
- Emitir extrato bancário GET /contas/extrato?numero_conta=123&senha=123

Importante: Sempre que a validação de uma requisição falhar, terá uma resposta com código de erro e mensagem adequada à situação.



## Tecnologias

Utilizamos as tecnologias no projeto como JavaScript, NodeJs, Express e Date-Fns.
## Inicialização

Após fazer o git clone, é necessário rodar um **npm install express** para instalar as dependências do express, **npm install date-fns --save** para as dependências de formatar as datas. 
## Implementações futuras
Essa é a primeira fase do projeto, vamos deixar ele mais limpo e com novas Implementações.
## Status do projeto

O projeto está no inicio.
