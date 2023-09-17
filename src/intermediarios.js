const { banco } = require('./bancodedados');

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.json({ "mensagem": "A senha do banco não foi encontrada." })
    };

    if (senha_banco !== banco.senha) {
        return res.json({ "mensagem": "A senha do banco informada é inválida!" })
    };
    next()
}

module.exports = validarSenha
