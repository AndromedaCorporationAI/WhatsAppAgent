// Chatbot para Interações Básicas
// Funcionalidades: agendamentos, perguntas frequentes, cobranças e suporte inicial

class Chatbot {
    constructor() {
      this.nomeUsuario = '';
      this.agenda = []; // Array para armazenar agendamentos
      this.conversationContext = null;
      
      // Base de perguntas frequentes
      this.faq = {
        "horario": "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h.",
        "endereco": "Estamos localizados na Av. Principal, 1000, Centro.",
        "pagamento": "Aceitamos pagamentos em dinheiro, cartões de crédito/débito e PIX.",
        "entrega": "O prazo de entrega médio é de 3 a 5 dias úteis, dependendo da sua localização."
      };
      
      // Informações sobre cobranças
      this.cobrancaInfo = {
        "metodos": "Oferecemos pagamento via boleto, cartão de crédito (até 12x), PIX e transferência bancária.",
        "desconto": "Oferecemos 10% de desconto para pagamentos à vista.",
        "atraso": "Em caso de atraso, é cobrada uma taxa de 2% mais juros de 0,1% ao dia.",
        "reembolso": "O prazo para reembolso é de até 30 dias após a solicitação aprovada."
      };
    }
  
    // Método principal para processar mensagens do usuário
    processMessage(message) {
      message = message.toLowerCase();
      
      // Saudação inicial e identificação
      if (!this.nomeUsuario && (message.includes("olá") || message.includes("oi") || message.includes("bom dia") || message.includes("boa tarde") || message.includes("boa noite"))) {
        return "Olá! Bem-vindo ao nosso atendimento virtual. Como posso chamá-lo(a)?";
      }
      
      // Captura do nome do usuário
      if (!this.nomeUsuario && !this.conversationContext) {
        this.nomeUsuario = message.charAt(0).toUpperCase() + message.slice(1);
        return `Prazer em conhecê-lo(a), ${this.nomeUsuario}! Como posso ajudar hoje? Você pode escolher uma das opções:\n1. Agendamento\n2. Dúvidas frequentes\n3. Informações sobre cobranças\n4. Suporte`;
      }
      
      // Navegação pelo menu principal
      if (!this.conversationContext) {
        if (message.includes("1") || message.includes("agendamento")) {
          this.conversationContext = "agendamento";
          return "Você escolheu Agendamento. O que deseja fazer?\n1. Novo agendamento\n2. Consultar agendamentos\n3. Cancelar agendamento";
        } 
        else if (message.includes("2") || message.includes("dúvida") || message.includes("duvida") || message.includes("faq")) {
          this.conversationContext = "faq";
          return "Sobre qual assunto você tem dúvidas?\n1. Horário de funcionamento\n2. Endereço\n3. Métodos de pagamento\n4. Prazo de entrega\n5. Outra dúvida";
        } 
        else if (message.includes("3") || message.includes("cobrança") || message.includes("pagamento")) {
          this.conversationContext = "cobranca";
          return "Sobre qual aspecto das cobranças você precisa de informações?\n1. Métodos de pagamento\n2. Descontos\n3. Taxas por atraso\n4. Política de reembolso";
        } 
        else if (message.includes("4") || message.includes("suporte") || message.includes("ajuda")) {
          this.conversationContext = "suporte";
          return "Como posso ajudá-lo(a) com suporte?\n1. Problemas técnicos\n2. Reclamações\n3. Elogios\n4. Falar com um atendente humano";
        } 
        else {
          return `Desculpe, ${this.nomeUsuario}, não entendi sua solicitação. Por favor, escolha uma das opções:\n1. Agendamento\n2. Dúvidas frequentes\n3. Informações sobre cobranças\n4. Suporte`;
        }
      }
      
      // Processamento baseado no contexto da conversa
      switch (this.conversationContext) {
        case "agendamento":
          return this.processAgendamento(message);
        case "faq":
          return this.processFAQ(message);
        case "cobranca":
          return this.processCobranca(message);
        case "suporte":
          return this.processSuporte(message);
        default:
          this.conversationContext = null;
          return `Desculpe, ${this.nomeUsuario}, ocorreu um erro. Vamos recomeçar. Como posso ajudá-lo(a)?`;
      }
    }
    
    // Processa solicitações de agendamento
    processAgendamento(message) {
      if (message.includes("1") || message.includes("novo")) {
        this.conversationContext = "novoAgendamento";
        return "Para um novo agendamento, por favor informe a data e hora desejada (ex: 15/05/2025 14:30):";
      } 
      else if (message.includes("2") || message.includes("consultar")) {
        if (this.agenda.length === 0) {
          this.conversationContext = null;
          return `${this.nomeUsuario}, você não possui agendamentos. Deseja fazer um novo agendamento? Digite 'sim' para continuar.`;
        } else {
          let agendamentos = "Seus agendamentos:\n";
          this.agenda.forEach((item, index) => {
            agendamentos += `${index + 1}. ${item.data} - ${item.motivo}\n`;
          });
          this.conversationContext = null;
          return agendamentos + "\nPara voltar ao menu principal, digite 'menu'.";
        }
      } 
      else if (message.includes("3") || message.includes("cancelar")) {
        if (this.agenda.length === 0) {
          this.conversationContext = null;
          return `${this.nomeUsuario}, você não possui agendamentos para cancelar. Digite 'menu' para voltar ao menu principal.`;
        } else {
          this.conversationContext = "cancelarAgendamento";
          let agendamentos = "Qual agendamento deseja cancelar? Digite o número:\n";
          this.agenda.forEach((item, index) => {
            agendamentos += `${index + 1}. ${item.data} - ${item.motivo}\n`;
          });
          return agendamentos;
        }
      } 
      else if (this.conversationContext === "novoAgendamento") {
        // Capturar data para novo agendamento
        const data = message;
        this.conversationContext = "motivoAgendamento";
        return `Data selecionada: ${data}. Qual o motivo do agendamento?`;
      } 
      else if (this.conversationContext === "motivoAgendamento") {
        // Capturar motivo e finalizar agendamento
        const motivo = message;
        const novoAgendamento = {
          data: "15/05/2025 14:30", // Usando um valor padrão pois não temos a data real
          motivo: motivo
        };
        this.agenda.push(novoAgendamento);
        this.conversationContext = null;
        return `Agendamento confirmado para 15/05/2025 14:30. Motivo: ${motivo}.\nDigite 'menu' para voltar ao menu principal.`;
      } 
      else if (this.conversationContext === "cancelarAgendamento") {
        // Processar cancelamento de agendamento
        const indice = parseInt(message) - 1;
        if (indice >= 0 && indice < this.agenda.length) {
          const agendamentoCancelado = this.agenda[indice];
          this.agenda.splice(indice, 1);
          this.conversationContext = null;
          return `Agendamento cancelado com sucesso: ${agendamentoCancelado.data} - ${agendamentoCancelado.motivo}.\nDigite 'menu' para voltar ao menu principal.`;
        } else {
          return "Número inválido. Por favor, digite o número correspondente ao agendamento que deseja cancelar:";
        }
      } 
      else {
        this.conversationContext = null;
        return `Desculpe, não entendi sua solicitação sobre agendamentos. Por favor, digite 'menu' para voltar ao menu principal.`;
      }
    }
    
    // Processa perguntas frequentes
    processFAQ(message) {
      if (message.includes("1") || message.includes("horario") || message.includes("horário") || message.includes("funcionamento")) {
        this.conversationContext = null;
        return this.faq.horario + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else if (message.includes("2") || message.includes("endereco") || message.includes("endereço") || message.includes("localização")) {
        this.conversationContext = null;
        return this.faq.endereco + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else if (message.includes("3") || message.includes("pagamento") || message.includes("pagar")) {
        this.conversationContext = null;
        return this.faq.pagamento + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else if (message.includes("4") || message.includes("entrega") || message.includes("prazo")) {
        this.conversationContext = null;
        return this.faq.entrega + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else if (message.includes("5") || message.includes("outra")) {
        this.conversationContext = "outraDuvida";
        return "Por favor, descreva sua dúvida em detalhes:";
      } 
      else if (this.conversationContext === "outraDuvida") {
        this.conversationContext = null;
        return `Obrigado pela sua pergunta, ${this.nomeUsuario}. Vou encaminhá-la para nossa equipe e em breve entraremos em contato com a resposta.\nDigite 'menu' para voltar ao menu principal.`;
      } 
      else {
        this.conversationContext = null;
        return `Desculpe, não entendi sua pergunta. Por favor, digite 'menu' para voltar ao menu principal.`;
      }
    }
    
    // Processa informações sobre cobranças
    processCobranca(message) {
      if (message.includes("1") || message.includes("método") || message.includes("metodo") || message.includes("pagamento")) {
        this.conversationContext = null;
        return this.cobrancaInfo.metodos + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else if (message.includes("2") || message.includes("desconto")) {
        this.conversationContext = null;
        return this.cobrancaInfo.desconto + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else if (message.includes("3") || message.includes("atraso") || message.includes("taxa")) {
        this.conversationContext = null;
        return this.cobrancaInfo.atraso + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else if (message.includes("4") || message.includes("reembolso") || message.includes("devolução")) {
        this.conversationContext = null;
        return this.cobrancaInfo.reembolso + "\nDigite 'menu' para voltar ao menu principal.";
      } 
      else {
        this.conversationContext = null;
        return `Desculpe, não entendi sua solicitação sobre cobranças. Por favor, digite 'menu' para voltar ao menu principal.`;
      }
    }
    
    // Processa solicitações de suporte
    processSuporte(message) {
      if (message.includes("1") || message.includes("problema") || message.includes("técnico")) {
        this.conversationContext = "problemasTecnicos";
        return "Por favor, descreva o problema técnico que está enfrentando:";
      } 
      else if (message.includes("2") || message.includes("reclamação") || message.includes("reclamacao")) {
        this.conversationContext = "reclamacao";
        return "Lamentamos pelo inconveniente. Por favor, descreva sua reclamação em detalhes:";
      } 
      else if (message.includes("3") || message.includes("elogio")) {
        this.conversationContext = "elogio";
        return "Ficamos felizes com seu feedback positivo! Por favor, compartilhe seu elogio:";
      } 
      else if (message.includes("4") || message.includes("atendente") || message.includes("humano")) {
        this.conversationContext = null;
        return `${this.nomeUsuario}, estou transferindo você para um atendente humano. Por favor, aguarde um momento. Um de nossos colaboradores entrará em contato em breve.`;
      } 
      else if (this.conversationContext === "problemasTecnicos" || this.conversationContext === "reclamacao" || this.conversationContext === "elogio") {
        this.conversationContext = null;
        return `Obrigado pelo seu relato, ${this.nomeUsuario}. Registramos sua mensagem e nossa equipe vai analisá-la com atenção. Caso seja necessário, entraremos em contato para mais informações.\nDigite 'menu' para voltar ao menu principal.`;
      } 
      else {
        this.conversationContext = null;
        return `Desculpe, não entendi sua solicitação de suporte. Por favor, digite 'menu' para voltar ao menu principal.`;
      }
    }
  }
  
  // Função para iniciar o chatbot
  function startChatbot() {
    const bot = new Chatbot();
    
    // Esta função seria chamada a cada mensagem recebida
    function handleUserMessage(userMessage) {
      if (userMessage.toLowerCase() === 'menu') {
        bot.conversationContext = null;
        return `${bot.nomeUsuario}, como posso ajudar?\n1. Agendamento\n2. Dúvidas frequentes\n3. Informações sobre cobranças\n4. Suporte`;
      }
      return bot.processMessage(userMessage);
    }
    
    // Retorna o objeto do chatbot e a função de manipulação de mensagens
    return {
      bot,
      handleUserMessage
    };
  }
  
const chatbot = startChatbot();
console.log(chatbot.handleUserMessage("Olá"));
console.log(chatbot.handleUserMessage("João"));
console.log(chatbot.handleUserMessage("1"));
