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
            "entrega": "O prazo de entrega médio é de 3 a 5 dias úteis, dependendo da sua localização."
        };
        this.cobrancaInfo = {
            "metodos": "Oferecemos pagamento via boleto, cartão de crédito (até 12x), PIX e transferência bancária.",
            "desconto": "Oferecemos 10% de desconto para pagamentos à vista.",
            "atraso": "Em caso de atraso, é cobrada uma taxa de 2% mais juros de 0,1% ao dia.",
            "reembolso": "O prazo para reembolso é de até 30 dias após a solicitação aprovada."
        };
    }

    processMessage(message) {
        message = message.toLowerCase();

        // Contexto inicial: Saudação e nome do usuário
        if (!this.nomeUsuario && (message.includes("olá") || message.includes("oi"))) {
            return "Olá! Bem-vindo ao nosso atendimento virtual. Como posso chamá-lo(a)?";
        }
        if (!this.nomeUsuario && !this.conversationContext) {
            this.nomeUsuario = message.charAt(0).toUpperCase() + message.slice(1);
            return `Prazer em conhecê-lo(a), ${this.nomeUsuario}! Como posso ajudar hoje?`;
        }

        // FAQ: Respostas automáticas para perguntas frequentes
        for (const [keyword, response] of Object.entries(this.faq)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        // Cobrança: Informações sobre métodos de pagamento, descontos, etc.
        for (const [keyword, response] of Object.entries(this.cobrancaInfo)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        // Agendamento
        if (message.includes("agendar")) {
            this.conversationContext = "agendamento";
            return "Claro! Para qual serviço você gostaria de agendar?";
        }

        if (this.conversationContext === "agendamento") {
            this.agenda.push(message);
            this.conversationContext = null;
            return `Agendamento realizado para: ${message}. Posso ajudar com algo mais?`;
        }

        // Cancelamento de agendamento
        if (message.includes("cancelar")) {
            if (this.agenda.length > 0) {
                const ultimoAgendamento = this.agenda.pop();
                return `O agendamento para "${ultimoAgendamento}" foi cancelado com sucesso.`;
            } else {
                return "Você não possui nenhum agendamento ativo.";
            }
        }

        // Verificação de pagamentos
        if (message.includes("verificar pagamento")) {
            return "Para verificar o status do pagamento, por favor informe o número do pedido ou código de referência.";
        }

        // Resposta padrão para mensagens desconhecidas
        return "Desculpe, não entendi sua solicitação. Poderia reformular ou ser mais específico?";
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
        const botResponse = chatbotInstance.processMessage(userMessage);
        setTimeout(() => addMessage(botResponse, 'bot'), 500); // Simulação de "pensamento"
        userInput.value = '';
    }
});

// Permitir envio ao pressionar Enter
document.getElementById('message-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});