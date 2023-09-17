const express = require('express');
const rotas = express();
const validarSenha = require('./intermediarios')

const { listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato }
    = require('./controladores/bancodigital');

rotas.get('/contas', validarSenha, listarContas);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta)
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);


module.exports = rotas