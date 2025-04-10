// Classe Chatbot Avançado para Andrômeda Corp
class Chatbot {
    constructor() {
        this.nomeUsuario = '';
        this.agenda = [];
        this.conversationContext = null;
        this.conversationHistory = [];
        this.lastInteractionTime = null;
        this.currentStep = null;
        this.pendingInfo = {};
        
        // Base de conhecimento expandida
        this.faq = {
            "horario": "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h.",
            "endereco": "Estamos localizados na Av. Principal, 1000, Centro.",
            "pagamento": "Aceitamos pagamentos em dinheiro, cartões de crédito/débito, PIX e transferência bancária.",
            "entrega": "O prazo de entrega médio é de 3 a 5 dias úteis, dependendo da sua localização.",
            "contato": "Você pode nos contatar pelo telefone (11) 5555-1234 ou pelo e-mail contato@andromedacorp.com.br",
            "garantia": "Todos os nossos produtos têm garantia mínima de 12 meses.",
            "suporte": "Nosso suporte técnico está disponível 24/7 através do chat ou pelo telefone (11) 5555-4321.",
            "empresa": "A Andrômeda Corp. é uma empresa de tecnologia fundada em 2015, especializada em soluções tecnológicas inovadoras para empresas de todos os portes."
        };
        
        this.cobrancaInfo = {
            "metodos": "Oferecemos pagamento via boleto, cartão de crédito (até 12x), PIX e transferência bancária.",
            "desconto": "Oferecemos 10% de desconto para pagamentos à vista e 5% para pagamentos via PIX.",
            "atraso": "Em caso de atraso, é cobrada uma taxa de 2% mais juros de 0,1% ao dia.",
            "reembolso": "O prazo para reembolso é de até 30 dias após a solicitação aprovada.",
            "parcelamento": "Oferecemos parcelamento em até 12x sem juros para compras acima de R$500.",
            "faturamento": "Para empresas, oferecemos opção de faturamento com prazo de 28 dias."
        };
        
        // Serviços disponíveis
        this.servicos = {
            "consultoria": {
                "nome": "Consultoria em TI",
                "descricao": "Análise completa da infraestrutura de TI e recomendações para otimização.",
                "preco": "A partir de R$1.500,00",
                "disponibilidade": "Segunda a sexta, das 9h às 17h"
            },
            "desenvolvimento": {
                "nome": "Desenvolvimento de Software",
                "descricao": "Criação de soluções personalizadas para o seu negócio.",
                "preco": "Orçamento sob consulta",
                "disponibilidade": "Projetos com prazo médio de 3 meses"
            },
            "suporte": {
                "nome": "Suporte Técnico",
                "descricao": "Assistência técnica para resolução de problemas de TI.",
                "preco": "R$150,00/hora ou plano mensal a partir de R$800,00",
                "disponibilidade": "24/7 com prioridade para clientes com plano mensal"
            }
        };
        
        // Fluxos de conversa predefinidos
        this.conversationFlows = {
            "agendamento": {
                steps: ["servico", "data", "horario", "nome", "contato", "confirmacao"],
                currentStep: 0,
                data: {}
            },
            "orcamento": {
                steps: ["servico", "detalhes", "prazo", "contato"],
                currentStep: 0,
                data: {}
            }
        };
        
        // Palavras-chave para entender intenções
        this.intencoes = {
            saudacao: ["oi", "olá", "bom dia", "boa tarde", "boa noite", "e aí", "tudo bem"],
            agendamento: ["agendar", "marcar", "consulta", "reunião", "horário", "disponibilidade"],
            cancelamento: ["cancelar", "desmarcar", "remover", "adiar"],
            precos: ["preço", "custo", "valor", "quanto custa", "orçamento", "investimento"],
            servicos: ["serviço", "consultoria", "desenvolvimento", "suporte", "oferecem"],
            pagamento: ["pagamento", "pagar", "boleto", "cartão", "pix", "transferência", "desconto"],
            finalizacao: ["obrigado", "valeu", "agradeço", "até logo", "tchau", "adeus"]
        };
    }

    // Método para iniciar o chatbot com uma mensagem personalizada
    iniciar() {
        const horaAtual = new Date().getHours();
        let saudacao = "";

        if (horaAtual >= 5 && horaAtual < 12) {
            saudacao = "Bom dia";
        } else if (horaAtual >= 12 && horaAtual < 18) {
            saudacao = "Boa tarde";
        } else {
            saudacao = "Boa noite";
        }

        return `${saudacao}! Sou o assistente virtual da Andrômeda Corp. Como posso ajudá-lo hoje? Posso fornecer informações sobre nossos serviços, agendar uma consultoria, ou responder dúvidas sobre pagamentos e suporte.`;
    }

    // Método principal para processar mensagens do usuário
    processMessage(message) {
        // Registrar mensagem no histórico
        this.conversationHistory.push({
            sender: 'user',
            message: message,
            timestamp: new Date()
        });
        
        // Atualizar tempo da última interação
        this.lastInteractionTime = new Date();
        
        // Normalizar a mensagem do usuário
        const normalizedMessage = message.toLowerCase().trim();
        
        // Verificar se o chatbot está em um fluxo de conversa específico
        if (this.currentStep !== null) {
            const response = this.processConversationFlow(normalizedMessage);
            if (response) {
                this.addToHistory('bot', response);
                return response;
            }
        }
        
        // Obter nome do usuário se ainda não tiver
        if (!this.nomeUsuario) {
            // Se for uma saudação, perguntar o nome
            if (this.matchIntencao(normalizedMessage, this.intencoes.saudacao)) {
                this.conversationContext = "solicitando_nome";
                const response = "Olá! Bem-vindo ao atendimento virtual da Andrômeda Corp. Como posso chamá-lo(a)?";
                this.addToHistory('bot', response);
                return response;
            }
            
            // Se não for saudação, assumir que a mensagem é o nome
            if (this.conversationContext === "solicitando_nome" || !this.conversationContext) {
                this.nomeUsuario = this.capitalizeName(normalizedMessage);
                this.conversationContext = null;
                const response = `Prazer em conhecê-lo(a), ${this.nomeUsuario}! Como posso ajudar hoje? Posso falar sobre nossos serviços, agendar uma consultoria ou responder perguntas sobre pagamentos.`;
                this.addToHistory('bot', response);
                return response;
            }
        }
        
        // Verificar intenções do usuário
        if (this.matchIntencao(normalizedMessage, this.intencoes.saudacao)) {
            const response = this.nomeUsuario ? 
                `Olá ${this.nomeUsuario}! Em que posso ajudá-lo hoje?` : 
                "Olá! Como posso ajudá-lo hoje?";
            this.addToHistory('bot', response);
            return response;
        }
        
        // Intenção de finalização
        if (this.matchIntencao(normalizedMessage, this.intencoes.finalizacao)) {
            const response = this.nomeUsuario ? 
                `Foi um prazer ajudá-lo, ${this.nomeUsuario}! Se precisar de mais alguma coisa, estou à disposição. Tenha um ótimo dia!` : 
                "Foi um prazer ajudá-lo! Se precisar de mais alguma coisa, estou à disposição. Tenha um ótimo dia!";
            this.addToHistory('bot', response);
            return response;
        }
        
        // Intenção de agendamento
        if (this.matchIntencao(normalizedMessage, this.intencoes.agendamento)) {
            this.iniciarFluxo("agendamento");
            const response = "Claro! Vamos agendar seu atendimento. Qual serviço você tem interesse? Temos consultoria em TI, desenvolvimento de software e suporte técnico.";
            this.addToHistory('bot', response);
            return response;
        }
        
        // Intenção de cancelamento
        if (this.matchIntencao(normalizedMessage, this.intencoes.cancelamento)) {
            if (this.agenda.length > 0) {
                const ultimoAgendamento = this.agenda.pop();
                const response = `O agendamento para "${ultimoAgendamento.servico}" no dia ${ultimoAgendamento.data} às ${ultimoAgendamento.horario} foi cancelado com sucesso.`;
                this.addToHistory('bot', response);
                return response;
            } else {
                const response = "Você não possui nenhum agendamento ativo. Gostaria de agendar um atendimento agora?";
                this.addToHistory('bot', response);
                return response;
            }
        }
        
        // Intenção de preços/orçamento
        if (this.matchIntencao(normalizedMessage, this.intencoes.precos)) {
            // Verificar se a mensagem menciona um serviço específico
            for (const [key, servico] of Object.entries(this.servicos)) {
                if (normalizedMessage.includes(key) || normalizedMessage.includes(servico.nome.toLowerCase())) {
                    const response = `O valor para ${servico.nome} é ${servico.preco}. ${servico.descricao} Gostaria de mais informações ou de agendar este serviço?`;
                    this.addToHistory('bot', response);
                    return response;
                }
            }
            
            // Se não mencionar serviço específico
            const response = "Temos diferentes serviços com valores variados. Consultoria em TI a partir de R$1.500,00, Desenvolvimento de Software com orçamento personalizado, e Suporte Técnico por R$150,00/hora ou planos mensais a partir de R$800,00. Sobre qual serviço você gostaria de saber mais?";
            this.addToHistory('bot', response);
            return response;
        }
        
        // Intenção sobre serviços
        if (this.matchIntencao(normalizedMessage, this.intencoes.servicos)) {
            // Verificar se a mensagem menciona um serviço específico
            for (const [key, servico] of Object.entries(this.servicos)) {
                if (normalizedMessage.includes(key) || normalizedMessage.includes(servico.nome.toLowerCase())) {
                    const response = `${servico.nome}: ${servico.descricao} O valor é ${servico.preco}. Disponibilidade: ${servico.disponibilidade}. Gostaria de agendar ou saber mais?`;
                    this.addToHistory('bot', response);
                    return response;
                }
            }
            
            // Se não mencionar serviço específico
            const response = "A Andrômeda Corp. oferece três serviços principais:\n1. Consultoria em TI: análise completa da sua infraestrutura e recomendações de otimização.\n2. Desenvolvimento de Software: criação de soluções personalizadas para o seu negócio.\n3. Suporte Técnico: assistência para resolução de problemas de TI.\n\nSobre qual serviço você gostaria de saber mais?";
            this.addToHistory('bot', response);
            return response;
        }
        
        // Verificar FAQ
        for (const [keyword, response] of Object.entries(this.faq)) {
            if (normalizedMessage.includes(keyword)) {
                this.addToHistory('bot', response);
                return response;
            }
        }
        
        // Verificar informações de cobrança
        for (const [keyword, response] of Object.entries(this.cobrancaInfo)) {
            if (normalizedMessage.includes(keyword)) {
                this.addToHistory('bot', response);
                return response;
            }
        }
        
        // Se chegou até aqui, não encontrou uma resposta específica
        // Tentar encontrar palavras-chave parciais
        for (const [keyword, response] of Object.entries({...this.faq, ...this.cobrancaInfo})) {
            // Dividir a keyword em palavras
            const keywordParts = keyword.split(" ");
            for (const part of keywordParts) {
                if (part.length > 3 && normalizedMessage.includes(part)) {
                    this.addToHistory('bot', response);
                    return response;
                }
            }
        }
        
        // Resposta padrão para mensagens desconhecidas
        const defaultResponses = [
            "Desculpe, não entendi completamente sua solicitação. Poderia reformular ou ser mais específico?",
            `${this.nomeUsuario ? this.nomeUsuario + ', p' : 'P'}osso ajudar com informações sobre nossos serviços, agendamentos, pagamentos ou suporte. O que você precisa?`,
            "Não consegui compreender sua pergunta. Posso fornecer informações sobre consultoria, desenvolvimento de software ou suporte técnico. O que você gostaria de saber?",
            "Hmm, não tenho certeza do que você está perguntando. Poderia tentar novamente com outras palavras?"
        ];
        
        const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        this.addToHistory('bot', randomResponse);
        return randomResponse;
    }
    
    // Método para iniciar um fluxo de conversa predefinido
    iniciarFluxo(tipoFluxo) {
        if (this.conversationFlows[tipoFluxo]) {
            this.currentStep = tipoFluxo;
            this.conversationFlows[tipoFluxo].currentStep = 0;
            this.conversationFlows[tipoFluxo].data = {};
        }
    }
    
    // Método para processar mensagens dentro de um fluxo de conversa
    processConversationFlow(message) {
        if (!this.currentStep) return null;
        
        const flow = this.conversationFlows[this.currentStep];
        const currentStepName = flow.steps[flow.currentStep];
        
        // Processar resposta baseada no passo atual
        switch (this.currentStep) {
            case "agendamento":
                return this.processAgendamentoFlow(message, flow, currentStepName);
            case "orcamento":
                return this.processOrcamentoFlow(message, flow, currentStepName);
            default:
                return null;
        }
    }
    
    // Processamento específico para fluxo de agendamento
    processAgendamentoFlow(message, flow, currentStepName) {
        switch (currentStepName) {
            case "servico":
                // Verificar qual serviço foi solicitado
                let servicoSelecionado = null;
                for (const [key, servico] of Object.entries(this.servicos)) {
                    if (message.toLowerCase().includes(key) || 
                        message.toLowerCase().includes(servico.nome.toLowerCase())) {
                        servicoSelecionado = servico.nome;
                        break;
                    }
                }
                
                if (!servicoSelecionado) {
                    // Se não identificou o serviço claramente
                    return "Por favor, especifique qual serviço você deseja agendar: Consultoria em TI, Desenvolvimento de Software ou Suporte Técnico.";
                }
                
                // Armazenar o serviço e avançar para o próximo passo
                flow.data.servico = servicoSelecionado;
                flow.currentStep++;
                return `Ótimo! Você escolheu ${servicoSelecionado}. Para qual data você gostaria de agendar? (formato: dd/mm/aaaa)`;
                
            case "data":
                // Validar o formato da data
                const dataRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
                const dataMatch = message.match(dataRegex);
                
                if (!dataMatch) {
                    return "Por favor, informe a data no formato dd/mm/aaaa (exemplo: 15/05/2025).";
                }
                
                const data = message.trim();
                flow.data.data = data;
                flow.currentStep++;
                return `Data agendada para ${data}. Qual horário você prefere? Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.`;
                
            case "horario":
                // Validar formato de horário
                const horarioRegex = /(\d{1,2}):(\d{2})/;
                const horarioMatch = message.match(horarioRegex);
                
                if (!horarioMatch) {
                    return "Por favor, informe o horário no formato hh:mm (exemplo: 14:30).";
                }
                
                const horario = message.trim();
                flow.data.horario = horario;
                
                // Se já sabemos o nome do usuário, pular para o próximo passo
                if (this.nomeUsuario) {
                    flow.data.nome = this.nomeUsuario;
                    flow.currentStep += 2; // Pular o passo de nome
                    return `Ótimo, ${this.nomeUsuario}! Precisamos de um contato (telefone ou e-mail) para confirmar seu agendamento.`;
                }
                
                flow.currentStep++;
                return "Por favor, informe seu nome completo para o agendamento.";
                
            case "nome":
                const nome = this.capitalizeName(message);
                flow.data.nome = nome;
                this.nomeUsuario = nome; // Atualizar o nome do usuário globalmente
                flow.currentStep++;
                return `Obrigado, ${nome}! Agora precisamos de um contato (telefone ou e-mail) para confirmar seu agendamento.`;
                
            case "contato":
                // Validação básica de e-mail ou telefone
                const emailRegex = /\S+@\S+\.\S+/;
                const telefoneRegex = /(\d{10,11})|(\d{2}[-. ]\d{4,5}[-. ]\d{4})/;
                
                if (!emailRegex.test(message) && !telefoneRegex.test(message.replace(/\D/g, ''))) {
                    return "Por favor, informe um e-mail válido ou um telefone com DDD.";
                }
                
                flow.data.contato = message.trim();
                flow.currentStep++;
                
                // Preparar resumo para confirmação
                const resumo = `Serviço: ${flow.data.servico}\nData: ${flow.data.data}\nHorário: ${flow.data.horario}\nNome: ${flow.data.nome}\nContato: ${flow.data.contato}`;
                
                return `Por favor, confirme os dados do seu agendamento:\n\n${resumo}\n\nEstá correto? (sim/não)`;
                
            case "confirmacao":
                if (message.toLowerCase().includes("sim") || message.toLowerCase().includes("correto") || message.toLowerCase() === "s") {
                    // Finalizar agendamento
                    this.agenda.push({...flow.data});
                    this.currentStep = null; // Encerrar o fluxo
                    
                    return `Agendamento confirmado com sucesso! Enviaremos uma confirmação para o contato ${flow.data.contato}. Obrigado pela preferência, ${flow.data.nome}. Posso ajudar com mais alguma coisa?`;
                } else {
                    // Cancelar ou reiniciar
                    this.currentStep = null;
                    return "Agendamento cancelado. Você gostaria de tentar novamente ou posso ajudar com outra coisa?";
                }
        }
    }
    
    // Processamento específico para fluxo de orçamento
    processOrcamentoFlow(message, flow, currentStepName) {
        // Implementação similar ao fluxo de agendamento
        // ...
        
        // Versão simplificada para demonstração
        this.currentStep = null;
        return "Recebi sua solicitação de orçamento. Um de nossos consultores entrará em contato em breve!";
    }
    
    // Método auxiliar para adicionar mensagem ao histórico
    addToHistory(sender, message) {
        this.conversationHistory.push({
            sender: sender,
            message: message,
            timestamp: new Date()
        });
    }
    
    // Método auxiliar para verificar se uma mensagem corresponde a uma intenção
    matchIntencao(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
    
    // Método auxiliar para capitalizar nome
    capitalizeName(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    
    // Método para sugerir respostas rápidas baseadas no contexto
    sugerirRespostasRapidas() {
        if (!this.currentStep) {
            return [
                "Quero agendar um serviço",
                "Quais são os serviços oferecidos?",
                "Informações sobre pagamentos",
                "Horário de funcionamento"
            ];
        }
        
        // Sugestões baseadas no fluxo atual
        if (this.currentStep === "agendamento") {
            const flow = this.conversationFlows[this.currentStep];
            const currentStepName = flow.steps[flow.currentStep];
            
            switch (currentStepName) {
                case "servico":
                    return ["Consultoria em TI", "Desenvolvimento de Software", "Suporte Técnico"];
                case "data":
                    const hoje = new Date();
                    const amanha = new Date(hoje);
                    amanha.setDate(hoje.getDate() + 1);
                    const proxSemana = new Date(hoje);
                    proxSemana.setDate(hoje.getDate() + 7);
                    
                    return [
                        this.formatarData(amanha),
                        this.formatarData(proxSemana),
                        "Próxima segunda-feira"
                    ];
                case "horario":
                    return ["09:00", "14:30", "16:00"];
                case "confirmacao":
                    return ["Sim, confirmo", "Não, preciso corrigir"];
                default:
                    return [];
            }
        }
        
        return [];
    }
    
    // Método auxiliar para formatar data
    formatarData(data) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }
}

// Função para adicionar mensagens ao chat
function addMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
    
    // Converter URLs em links clicáveis
    const messageWithLinks = message.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" class="chat-link">$1</a>'
    );
    
    messageElement.innerHTML = messageWithLinks;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Animação de digitação para mensagens do bot
    if (sender === 'bot') {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Função para exibir sugestões de resposta rápida
function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = '';
    
    if (!suggestions || suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
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
    
    suggestionsContainer.style.display = 'flex';
}

// Inicialização do Chatbot
const chatbotInstance = new Chatbot();

// Exibir mensagem inicial de boas-vindas
document.addEventListener('DOMContentLoaded', () => {
    const initialMessage = chatbotInstance.iniciar();
    setTimeout(() => {
        addMessage(initialMessage, 'bot');
        // Mostrar sugestões iniciais
        displaySuggestions(chatbotInstance.sugerirRespostasRapidas());
    }, 500);
    
    // Adicionar indicador de digitação
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    document.getElementById('chat-messages').appendChild(typingIndicator);
    
    // Esconder inicialmente
    typingIndicator.style.display = 'none';
});

// Função para mostrar indicador de digitação
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Função para esconder indicador de digitação
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Captura de mensagens do usuário
document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('message-input');
    const userMessage = userInput.value.trim();
    if (userMessage) {
        // Desativar sugestões ao enviar mensagem
        displaySuggestions([]);
        
        // Exibir mensagem do usuário
        addMessage(userMessage, 'user');
        
        // Limpar input
        userInput.value = '';
        
        // Mostrar indicador de digitação
        showTypingIndicator();
        
        // Simular tempo de resposta do bot (varia com base na complexidade da mensagem)
        const responseTime = Math.min(1000 + userMessage.length * 20, 3000);
        
        setTimeout(() => {
            // Esconder indicador de digitação
            hideTypingIndicator();
            
            // Obter e exibir resposta do bot
            const botResponse = chatbotInstance.processMessage(userMessage);
            addMessage(botResponse, 'bot');
            
            // Mostrar sugestões após resposta
            displaySuggestions(chatbotInstance.sugerirRespostasRapidas());
        }, responseTime);
    }
});

// Permitir envio ao pressionar Enter
document.getElementById('message-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});

// Detectar inatividade para sugerir interação
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (chatbotInstance.conversationHistory.length > 2) {
            const suggestions = [
                "Posso ajudar com mais alguma coisa?",
                "Gostaria de saber mais sobre nossos serviços?",
                "Precisa de ajuda para agendar uma consultoria?"
            ];
            const randomIndex = Math.floor(Math.random() * suggestions.length);
            addMessage(suggestions[randomIndex], 'bot');
            displaySuggestions(chatbotInstance.sugerirRespostasRapidas());
        }
    }, 120000); // 2 minutos de inatividade
}

// Reiniciar timer em interações do usuário
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
resetInactivityTimer();