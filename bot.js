// Classe Chatbot
class Chatbot {
    constructor() {
        this.nomeUsuario = '';
        this.agenda = [];
        this.conversationContext = null;
        this.faq = {
            "horario": "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h.",
            "endereco": "Estamos localizados na Av. Principal, 1000, Centro.",
            "pagamento": "Aceitamos pagamentos em dinheiro, cartões de crédito/débito e PIX.",
            "entrega": "O prazo de entrega médio é de 3 a 5 dias úteis, dependendo da sua localização.",
            "contato": "Você pode nos contatar pelo telefone (11) 5555-1234 ou pelo e-mail contato@andromedacorp.com.br.",
            "suporte": "Nossa equipe de suporte está disponível durante todo o horário comercial. Para clientes com plano mensal, oferecemos suporte 24/7.",
            "garantia": "Todos os nossos serviços possuem garantia de 90 dias.",
            "desenvolvimento": "Desenvolvemos aplicações web, mobile, sistemas empresariais e soluções personalizadas.",
            "consultoria": "Nossa consultoria em TI abrange análise de infraestrutura, segurança, otimização de processos e planejamento estratégico.",
            "prazo": "O prazo para desenvolvimento de software varia conforme a complexidade do projeto, geralmente entre 1 a 6 meses."
        };
        this.cobrancaInfo = {
            "metodos": "Oferecemos pagamento via boleto, cartão de crédito (até 12x), PIX e transferência bancária.",
            "desconto": "Oferecemos 10% de desconto para pagamentos à vista.",
            "atraso": "Em caso de atraso, é cobrada uma taxa de 2% mais juros de 0,1% ao dia.",
            "reembolso": "O prazo para reembolso é de até 30 dias após a solicitação aprovada.",
            "parcelas": "Parcelamos em até 12x no cartão de crédito, com juros a partir da 4ª parcela.",
            "contrato": "Todos os nossos serviços são formalizados via contrato, garantindo segurança para ambas as partes.",
            "precos": "Os preços variam conforme o escopo do projeto. Consultoria a partir de R$1.500,00 e suporte técnico a partir de R$150,00/hora."
        };
        this.servicosInfo = {
            "consultoria": "Nossa consultoria em TI oferece uma análise completa da infraestrutura tecnológica da sua empresa, identificando pontos de melhoria e oportunidades de otimização. Preços a partir de R$1.500,00.",
            "desenvolvimento": "Desenvolvemos soluções de software personalizadas para atender às necessidades específicas do seu negócio. Orçamentos sob consulta, baseados no escopo do projeto.",
            "suporte": "Nosso serviço de suporte técnico oferece assistência rápida e eficiente para resolver problemas de TI. Disponível por R$150,00/hora ou plano mensal a partir de R$800,00.",
            "treinamento": "Oferecemos treinamentos personalizados para sua equipe utilizar melhor os recursos tecnológicos. Turmas a partir de R$2.000,00.",
            "auditoria": "Realizamos auditoria completa em sua infraestrutura de TI e segurança digital. Serviço a partir de R$3.000,00.",
            "cloud": "Serviços de migração e gestão de ambientes em nuvem, com planos a partir de R$1.200,00 mensais."
        };
    }

    iniciar() {
        // Mensagem inicial com sugestões de tópicos
        return "Olá! Sou o assistente virtual da Andrômeda Corp. Sobre o que gostaria de falar hoje?\n\nPosso ajudar com:\n- Informações sobre nossos serviços\n- Métodos de pagamento\n- Agendamento de consultorias\n- Solicitação de orçamentos\n- Suporte técnico\n- Dúvidas frequentes";
    }

    sugerirRespostasRapidas() {
        // Sugestões de respostas rápidas baseadas no contexto atual
        if (!this.nomeUsuario) {
            return ["Olá", "Bom dia", "Boa tarde", "Boa noite"];
        }
        
        if (this.conversationContext === "agendamento") {
            return ["Consultoria em TI", "Desenvolvimento de Software", "Suporte Técnico", "Treinamento"];
        }
        
        if (this.conversationContext === "orcamento") {
            return ["Consultoria", "Desenvolvimento", "Suporte", "Auditoria de TI", "Serviços em Cloud"];
        }
        
        // Sugestões padrão
        return [
            "Quero saber sobre consultoria",
            "Preciso de um orçamento",
            "Métodos de pagamento",
            "Quero agendar um serviço",
            "Horário de funcionamento"
        ];
    }

    processMessage(message) {
        message = message.toLowerCase();

        // Contexto inicial: Saudação e nome do usuário
        if (!this.nomeUsuario && (message.includes("olá") || message.includes("oi") || message.includes("bom dia") || message.includes("boa tarde") || message.includes("boa noite"))) {
            return "Olá! Bem-vindo ao nosso atendimento virtual. Como posso chamá-lo(a)?";
        }
        
        if (!this.nomeUsuario && !this.conversationContext) {
            this.nomeUsuario = message.charAt(0).toUpperCase() + message.slice(1);
            return `Prazer em conhecê-lo(a), ${this.nomeUsuario}! ${this.iniciar()}`;
        }

        // Resposta para ajuda geral
        if (message.includes("ajuda") || message.includes("opções") || message.includes("o que você faz")) {
            return this.iniciar();
        }

        // FAQ: Respostas automáticas para perguntas frequentes
        for (const [keyword, response] of Object.entries(this.faq)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        // Cobrança: Informações sobre métodos de pagamento, descontos, etc.
        if (message.includes("pagamento") || message.includes("preço") || message.includes("valor") || message.includes("desconto") || message.includes("reembolso") || message.includes("parcela")) {
            for (const [keyword, response] of Object.entries(this.cobrancaInfo)) {
                if (message.includes(keyword)) {
                    return response;
                }
            }
            // Resposta padrão sobre pagamentos
            return "Oferecemos diversas formas de pagamento, incluindo cartão, boleto, PIX e transferência. Gostaria de informações mais específicas sobre algum método de pagamento, descontos ou parcelamento?";
        }

        // Serviços: Informações sobre os serviços oferecidos
        if (message.includes("serviço") || message.includes("oferecem") || message.includes("trabalho") || message.includes("produto")) {
            return "Na Andrômeda Corp., oferecemos diversos serviços de tecnologia, incluindo:\n\n- Consultoria em TI\n- Desenvolvimento de Software\n- Suporte Técnico\n- Treinamentos\n- Auditoria de TI\n- Serviços em Cloud\n\nSobre qual serviço gostaria de saber mais detalhes?";
        }

        // Informações detalhadas sobre serviços específicos
        for (const [keyword, response] of Object.entries(this.servicosInfo)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        // Solicitar orçamento
        if (message.includes("orçamento") || message.includes("proposta") || message.includes("quanto custa") || message.includes("preço de") || message.includes("valor de")) {
            this.conversationContext = "orcamento";
            return "Claro! Para qual serviço você gostaria de receber um orçamento? (Consultoria, Desenvolvimento, Suporte, Treinamento, Auditoria de TI ou Serviços em Cloud)";
        }

        if (this.conversationContext === "orcamento") {
            let servico = "não especificado";
            
            for (const keyword of Object.keys(this.servicosInfo)) {
                if (message.includes(keyword)) {
                    servico = keyword;
                    break;
                }
            }
            
            this.conversationContext = null;
            return `Obrigado pelo interesse! Vou registrar sua solicitação de orçamento para ${servico}. Em breve, um de nossos consultores entrará em contato para entender melhor sua necessidade e preparar uma proposta personalizada. Posso ajudar com mais alguma informação?`;
        }

        // Agendamento
        if (message.includes("agendar") || message.includes("marcar") || message.includes("reunião") || message.includes("consulta")) {
            this.conversationContext = "agendamento";
            return "Claro! Para qual serviço você gostaria de agendar um atendimento? (Consultoria, Desenvolvimento, Suporte ou Treinamento)";
        }

        if (this.conversationContext === "agendamento") {
            this.agenda.push(message);
            this.conversationContext = "agendamento_data";
            return `Ótimo! Qual seria a melhor data e horário para o seu atendimento de ${message}?`;
        }
        
        if (this.conversationContext === "agendamento_data") {
            const servico = this.agenda[this.agenda.length - 1];
            this.agenda.push(message); // Salva a data e hora
            this.conversationContext = null;
            return `Perfeito! Seu agendamento para ${servico} foi registrado para ${message}. Um de nossos atendentes entrará em contato para confirmar. Posso ajudar com mais alguma coisa?`;
        }

        // Cancelamento de agendamento
        if (message.includes("cancelar") || message.includes("desmarcar")) {
            if (this.agenda.length > 0) {
                if (this.agenda.length % 2 === 0) { // Se tiver data e serviço completos
                    const ultimoServico = this.agenda[this.agenda.length - 2];
                    const ultimaData = this.agenda[this.agenda.length - 1];
                    this.agenda.pop();
                    this.agenda.pop();
                    return `O agendamento de ${ultimoServico} marcado para ${ultimaData} foi cancelado com sucesso.`;
                } else {
                    const ultimoServico = this.agenda.pop();
                    return `O agendamento de ${ultimoServico} (ainda sem data confirmada) foi cancelado com sucesso.`;
                }
            } else {
                return "Você não possui nenhum agendamento ativo para cancelar.";
            }
        }

        // Verificação de agendamentos
        if (message.includes("meus agendamentos") || message.includes("consultar agenda") || message.includes("verificar agendamento")) {
            if (this.agenda.length === 0) {
                return "Você não possui nenhum agendamento ativo no momento.";
            }
            
            let resposta = "Aqui estão seus agendamentos:";
            for (let i = 0; i < this.agenda.length; i += 2) {
                const servico = this.agenda[i];
                const data = i + 1 < this.agenda.length ? this.agenda[i + 1] : "Data ainda não confirmada";
                resposta += `\n- ${servico}: ${data}`;
            }
            
            return resposta;
        }

        // Suporte técnico
        if (message.includes("suporte") || message.includes("problema") || message.includes("erro") || message.includes("ajuda técnica")) {
            return "Para suporte técnico, precisamos de algumas informações:\n\n1. Qual o problema específico que está enfrentando?\n2. Qual sistema ou equipamento está com problema?\n3. Desde quando o problema ocorre?\n\nApós receber essas informações, encaminharei para nossa equipe técnica.";
        }

        // Contato
        if (message.includes("contato") || message.includes("falar com atendente") || message.includes("pessoa real") || message.includes("telefone") || message.includes("email")) {
            return "Você pode entrar em contato conosco pelos seguintes canais:\n\n- Telefone: (11) 5555-1234\n- Email: contato@andromedacorp.com.br\n- Endereço: Av. Principal, 1000, Centro\n\nNosso horário de atendimento é de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h.";
        }

        // Feedback
        if (message.includes("feedback") || message.includes("avaliação") || message.includes("sugestão") || message.includes("reclamação")) {
            return "Agradecemos por querer compartilhar sua experiência! Seu feedback é muito importante para melhorarmos nossos serviços. Por favor, conte-nos o que achou do nosso atendimento ou serviço.";
        }

        // Despedida
        if (message.includes("tchau") || message.includes("adeus") || message.includes("até logo") || message.includes("até mais") || message.includes("obrigado")) {
            return `Foi um prazer atendê-lo(a), ${this.nomeUsuario}! Se precisar de mais informações, estou à disposição. Tenha um ótimo dia!`;
        }

        // Inteligência artificial
        if (message.includes("inteligência artificial") || message.includes("ia") || message.includes("chatbot") || message.includes("bot")) {
            return "Sou um assistente virtual desenvolvido pela equipe da Andrômeda Corp. para facilitar o atendimento inicial. Posso responder perguntas frequentes, ajudar com agendamentos e fornecer informações sobre nossos serviços. Para questões mais complexas, encaminho para nossa equipe humana especializada.";
        }

        // Resposta padrão para mensagens desconhecidas
        return "Não tenho certeza se entendi completamente. Posso ajudar com informações sobre nossos serviços, agendamentos, métodos de pagamento ou suporte técnico. Poderia reformular sua pergunta ou escolher um desses tópicos?";
    }
}

// Função para adicionar mensagens ao chat
function addMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Inicialização do Chatbot
const chatbotInstance = new Chatbot();

// Captura de mensagens do usuário
document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('message-input');
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, 'user');
        
        // Mostrar indicador de digitação
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
        }
        
        // Processar mensagem e responder com atraso para simular "pensamento"
        setTimeout(() => {
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
            }
            const botResponse = chatbotInstance.processMessage(userMessage);
            addMessage(botResponse, 'bot');
            
            // Atualizar sugestões de resposta após cada interação
            displaySuggestions(chatbotInstance.sugerirRespostasRapidas());
        }, 800);
        
        userInput.value = '';
    }
});

// Permitir envio ao pressionar Enter
document.getElementById('message-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});

// Função para exibir sugestões de resposta rápida
function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const suggestionButton = document.createElement('button');
        suggestionButton.classList.add('suggestion-btn');
        suggestionButton.textContent = suggestion;
        
        suggestionButton.addEventListener('click', () => {
            document.getElementById('message-input').value = suggestion;
            document.getElementById('send-button').click();
        });
        
        suggestionsContainer.appendChild(suggestionButton);
    });
}

// Iniciar o chat quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
    // Mostrar mensagem inicial com um pequeno atraso
    setTimeout(() => {
        const initialMessage = chatbotInstance.iniciar();
        addMessage(initialMessage, 'bot');
        
        // Mostrar sugestões iniciais
        displaySuggestions(chatbotInstance.sugerirRespostasRapidas());
    }, 500);
});