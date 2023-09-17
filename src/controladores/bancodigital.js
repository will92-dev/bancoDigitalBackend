const { banco, contas, saques, depositos, transferencia, transferencias } = require('../bancodedados');

const { format } = require('date-fns');

const listarContas = (req, res) => {

    res.status(200).send(contas)

}
const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const cpfUnico = contas.find((cpfUnico) => {
        return cpfUnico.usuario.cpf === cpf;
    })
    const emailUnico = contas.find((emailUnico) => {
        return emailUnico.usuario.email === email;
    })


    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "O preenchimento de todos os campos é obrigatório!" })
    }

    if (emailUnico || cpfUnico) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" })
    }
    function ultimoNumero() {
        if (contas.length === 0) {
            return 0
        }

        const contasOrdenadas = contas.sort((a, b) => parseInt(b.numero) - parseInt(a.numero))
        return parseInt(contasOrdenadas[0].numero);
    }

    const numeroConta = (ultimoNumero() + 1).toString()

    let novaConta = {
        "numero": numeroConta,
        "saldo": 0,
        "usuario": {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta)

    return res.send()
}
const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero === numeroConta;
    })
    if (!conta) {
        res.status(400).json({ "mensagem": "Conta não encontrada" })
    }

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "O preenchimento de todos os campos é obrigatório!" })
    }

    const outrasContas = contas.filter((outrasContas) => {
        return outrasContas.numero !== numeroConta
    })

    const cpfUnico = outrasContas.find((cpfUnico) => {
        return cpfUnico.usuario.cpf === cpf;
    })

    if (cpfUnico) {
        return res.status(400).json({ "mensagem": "O CPF informado já existe cadastrado!" })
    }

    const emailUnico = outrasContas.find((emailUnico) => {
        return emailUnico.usuario.email === email;
    })

    if (emailUnico) {
        return res.status(400).json({ "mensagem": "O Email informado já existe cadastrado!" })
    }

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;


    return res.send()
}
const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero === numeroConta;
    })
    if (!conta) {
        res.status(400).json({ "mensagem": "Conta não encontrada" })
    }
    if (conta.saldo > 0) {
        {
            res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
        }
    }
    contas.splice(conta, 1)

    return res.json()
}
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    if (!numero_conta || !valor) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" })
    }
    const conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    })
    if (!conta) {
        return res.status(400).json({ "mensagem": "Conta não encontrada" })
    }
    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "Não permitido depositar valores negativos ou zerado." })
    }
    let saldoAtualizado = Number(conta.saldo) + Number(valor)

    conta.saldo = saldoAtualizado

    const date = new Date();

    let novoDeposito = {
        "data": format(date, "yyyy-MM-dd HH:mm:ss"),
        "numero_conta": numero_conta,
        "valor": valor
    }

    depositos.push(novoDeposito)

    return res.send()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    if (!numero_conta || !valor || !senha) {
        return res.json({ "mensagem": "O número da conta, senha e o valor são obrigatórios!" })
    }
    const conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    })
    if (!conta) {
        return res.status(400).json({ "mensagem": "Conta não encontrada" })
    }
    if (conta.usuario.senha !== senha) {
        return res.status(400).json({ "mensagem": "A senha da conta informada é inválida!" })
    };
    if (conta.saldo < valor) {
        return res.status(400).json({ "mensagem": "Saldo insuficiente para o saque!" })
    }
    conta.saldo = conta.saldo - valor

    const date = new Date();

    let novoSaque = {
        "data": format(date, "yyyy-MM-dd HH:mm:ss"),
        "numero_conta": numero_conta,
        "valor": valor
    }

    saques.push(novoSaque)

    return res.send()


}
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ "mensagem": "O número das contas, senha e o valor são obrigatórios!" })
    }
    const contaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem;
    })
    if (!contaOrigem) {
        return res.status(400).json({ "mensagem": "Conta de origem não encontrada" })
    }
    if (contaOrigem.usuario.senha !== senha) {
        return res.status(400).json({ "mensagem": "A senha da conta informada é inválida!" })
    };
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ "mensagem": "Saldo insuficiente para o saque!" })
    }
    const contaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino;
    })
    if (!contaDestino) {
        return res.status(400).json({ "mensagem": "Conta de destino não encontrada" })
    }

    contaOrigem.saldo = contaOrigem.saldo - valor
    contaDestino.saldo = contaDestino + valor

    const date = new Date();

    let novaTransferencia = {
        "data": format(date, "yyyy-MM-dd HH:mm:ss"),
        "numero_conta_origem": numero_conta_origem,
        "numero_conta_destino": numero_conta_destino,
        "valor": valor
    }

    transferencia.push(novaTransferencia)

    return res.send()

}
const saldo = (req, res) => {

    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.json({ "mensagem": "Os campos de Numero de conta e senha são obrigatorios" })
    }

    const conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    })

    if (!conta) {
        return res.status(400).json({ "mensagem": "Conta bancária não encontada!" })
    }

    if (conta.usuario.senha !== senha) {
        return res.status(400).json({ "mensagem": "Senha informada incorreta" })
    }
    return res.status(200).json(conta.saldo)
}
const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ "mensagem": "Os campos de Numero de conta e senha são obrigatorios" })
    }

    const conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    })

    if (!conta) {
        return res.status(400).json({ "mensagem": "Conta bancária não encontada!" })
    }

    if (conta.usuario.senha !== senha) {
        return res.status(400).json({ "mensagem": "Senha informada incorreta" })
    }

    let depositosFeitos = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta
    })
    let saquesFeitos = saques.filter((saque) => {
        return saque.numero_conta === numero_conta
    })
    let transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta
    })
    let transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta
    })

    return res.status(200).json({
        "depositos": depositosFeitos,
        "saques": saquesFeitos,
        "transferenciasEnviadas": transferenciasEnviadas,
        "transferenciasRecebidas": transferenciasRecebidas
    })
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
};
