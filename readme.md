# Como executar
Esse projeto requer o Node Package Manager (npm) para ser executado.
1. Clone o repositório
2. No terminal, navegue até o diretório do projeto usando `cd SUA/PATH/simulador-agenda`
3. Execute `npm install` e, após as instalações, execute `npm run`
4. No navegador de sua preferência, acesse `http://localhost:3000` para utilizar o sistema
5. Para finalizar a execução, feche a janela no navegador, retorne ao terminal e aperte *Ctrl+C*

# Requisitos
Uma clínica de saúde recebe dezenas de contatos por dia pelo WhatsApp perguntando:
- “Tem consulta para tal dia?”
- “Qual o horário disponível?”
- “Dá para marcar comigo?”

Hoje isso é feito manualmente.
A empresa quer um mini sistema de agendamento inteligente que:
- Mostre horários disponíveis
- Permita criar um agendamento
- Mostre dados reais de data, fuso horário e dias úteis

## O sistema

Este é um sistema web onde:
- O usuário escolhe uma data
- O sistema mostra horários disponíveis
- O usuário seleciona um horário e cria um agendamento
- O sistema salva e retorna a confirmação

Usando uma API pública real de datas e feriados.

### API obrigatória

https://date.nager.at/api/v3/PublicHolidays/2026/BR

O sistema consulta o calendário de feriados nacionais aqui.

### Arquitetura

O projeto foi desenvolvido com SQLite, JavaScript, HTML e CSS. Ele possui:
- Backend com rotas REST
- Persistência em banco de dados
- Consumo da API de feriados no backend
- Frontend web para interação do usuário

### Fluxo

Usuário escolhe data → Frontend chama backend → Backend consulta API de feriados →
Backend valida → Retorna horários → Usuário escolhe → Backend salva

### Endpoints possíveis

- GET /available?date=2026-02-10
- POST /appointments
- GET /appointments

### Regras de negócio

- Horário de funcionamento: 08:00 às 18:00
- Consultas duram 1 hora
- Não pode marcar em feriados, finais de semana ou horários ocupados