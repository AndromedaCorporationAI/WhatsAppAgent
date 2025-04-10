// Script para funcionalidades adicionais da interface

document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidade dos botões de serviço
    const serviceButtons = document.querySelectorAll('.service-btn');
    const modal = document.getElementById('service-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    
    // Detalhes dos serviços para o modal
    const serviceDetails = {
        "consultoria": {
            title: "Consultoria em TI",
            description: "Nossa consultoria em TI oferece uma análise completa da infraestrutura tecnológica da sua empresa, identificando pontos de melhoria e oportunidades de otimização. Nossos especialistas avaliam seus processos atuais e recomendam soluções personalizadas para aumentar a eficiência e reduzir custos.",
            benefits: [
                "Avaliação completa da infraestrutura de TI",
                "Identificação de vulnerabilidades de segurança",
                "Otimização de processos e recursos",
                "Redução de custos operacionais",
                "Planejamento estratégico para crescimento tecnológico"
            ],
            price: "A partir de R$1.500,00",
            schedule: "Agende uma reunião inicial sem compromisso"
        },
        "desenvolvimento": {
            title: "Desenvolvimento de Software",
            description: "Desenvolvemos soluções de software personalizadas para atender às necessidades específicas do seu negócio. Desde aplicações web e mobile até sistemas empresariais complexos, nossa equipe de desenvolvedores cria produtos de alta qualidade com foco na experiência do usuário e na escalabilidade.",
            benefits: [
                "Análise de requisitos detalhada",
                "Design centrado no usuário",
                "Desenvolvimento ágil e iterativo",
                "Testes abrangentes de qualidade",
                "Suporte contínuo e manutenção"
            ],
            price: "Orçamento sob consulta",
            schedule: "Solicite uma proposta personalizada"
        },
        "suporte": {
            title: "Suporte Técnico",
            description: "Nosso serviço de suporte técnico oferece assistência rápida e eficiente para resolver problemas de TI e manter seus sistemas funcionando sem interrupções. Contamos com uma equipe especializada disponível para atender suas necessidades, seja remotamente ou presencialmente.",
            benefits: [
                "Atendimento 24/7 para clientes com plano mensal",
                "Suporte remoto e presencial",
                "Resolução rápida de problemas",
                "Monitoramento preventivo",
                "Atualizações e manutenção programada"
            ],
            price: "R$150,00/hora ou plano mensal a partir de R$800,00",
            schedule: "Contrate agora ou solicite atendimento"
        }
    };
    
    // Abrir modal com detalhes do serviço
    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.getAttribute('data-service');
            const details = serviceDetails[service];
            
            if (details) {
                // Preencher o modal com os detalhes do serviço
                let benefitsList = '';
                details.benefits.forEach(benefit => {
                    benefitsList += `<li>${benefit}</li>`;
                });
                
                modalBody.innerHTML = `
                    <h2>${details.title}</h2>
                    <p>${details.description}</p>
                    <h3>Benefícios:</h3>
                    <ul>${benefitsList}</ul>
                    <p><strong>Investimento:</strong> ${details.price}</p>
                    <button class="modal-action-btn" data-action="schedule" data-service="${service}">${details.schedule}</button>
                `;
                
                // Mostrar o modal
                modal.style.display = 'block';
                
                // Adicionar evento ao botão de agendamento
                const scheduleBtn = modalBody.querySelector('.modal-action-btn');
                scheduleBtn.addEventListener('click', () => {
                    // Fechar o modal
                    modal.style.display = 'none';
                    
                    // Enviar mensagem para o chatbot
                    const message = `Quero agendar uma ${details.title}`;
                    document.getElementById('message-input').value = message;
                    document.getElementById('send-button').click();
                });
            }
        });
    });
    
    // Fechar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Botão para limpar o chat
    document.getElementById('clear-chat').addEventListener('click', () => {
        const chatMessages = document.getElementById('chat-messages');
        
        // Manter apenas o indicador de digitação
        const typingIndicator = document.getElementById('typing-indicator');
        chatMessages.innerHTML = '';
        chatMessages.appendChild(typingIndicator);
        
        // Reiniciar o chatbot
        const initialMessage = chatbotInstance.iniciar();
        setTimeout(() => {
            addMessage(initialMessage, 'bot');
            // Mostrar sugestões iniciais
            displaySuggestions(chatbotInstance.sugerirRespostasRapidas());
        }, 500);
    });
    
    // Detectar redimensionamento da janela para ajustar o chat
    window.addEventListener('resize', () => {
        adjustChatHeight();
    });
    
    // Ajustar a altura do chat com base na altura da janela
    function adjustChatHeight() {
        const windowHeight = window.innerHeight;
        const chatContainer = document.querySelector('.chat-container');
        const headerHeight = document.querySelector('